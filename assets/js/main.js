// ===== MAIN JAVASCRIPT FILE =====

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

// ===== APP INITIALIZATION =====
function initializeApp() {
    initializeTheme();
    initializeAnimations();
    initializeSwiper();
    initializeEventListeners();
    initializeTooltips();
    initializeLazyLoading();

    console.log('InStalkgram app initialized successfully');
}

// ===== THEME MANAGEMENT =====
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    // Theme toggle event listener
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);

    // Animate theme transition
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

// ===== ANIMATIONS =====
function initializeAnimations() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }

    // Add scroll animations for elements without AOS
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature-card, .step-card, .value-card').forEach(el => {
        observer.observe(el);
    });
}

// ===== SWIPER INITIALIZATION =====
function initializeSwiper() {
    if (typeof Swiper !== 'undefined') {
        const trendingSwiper = new Swiper('.trending-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                576: {
                    slidesPerView: 2,
                },
                768: {
                    slidesPerView: 3,
                },
                992: {
                    slidesPerView: 4,
                }
            }
        });
    }
}

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Search form submission
    const searchBtn = document.getElementById('searchBtn');
    const usernameInput = document.getElementById('usernameInput');

    if (searchBtn && usernameInput) {
        searchBtn.addEventListener('click', handleSearch);
        usernameInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Newsletter subscription
    const newsletterForms = document.querySelectorAll('form');
    newsletterForms.forEach(form => {
        const emailInput = form.querySelector('input[type="email"]');
        const submitBtn = form.querySelector('button[type="button"]');

        if (emailInput && submitBtn && submitBtn.textContent.includes('Subscribe')) {
            submitBtn.addEventListener('click', handleNewsletterSubscription);
        }
    });

    // Back to top functionality
    const backToTopBtn = createBackToTopButton();
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    // Navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);

    // Handle window resize
    window.addEventListener('resize', debounce(handleWindowResize, 250));
}

// ===== SEARCH FUNCTIONALITY =====
async function handleSearch() {
    const usernameInput = document.getElementById("usernameInput");
    const username = usernameInput.value.trim();

    if (!username) {
        showNotification("Please enter a username", "warning");
        return;
    }

    if (!isValidUsername(username)) {
        showNotification("Please enter a valid Instagram username", "error");
        return;
    }

    showLoadingOverlay();
    addToRecentSearches(username);

    try {
        const [profileData, postsData] = await Promise.all([
            fetchProfile(username),
            fetchPosts(username)
        ]);

        hideLoadingOverlay();
        displayProfile(profileData);
        displayPosts(postsData.posts);
        scrollToResults();

    } catch (error) {
        hideLoadingOverlay();
        showNotification(error.message || "Failed to fetch Instagram data. Please try again.", "error");
        console.error("Search error:", error);
    }
}

function isValidUsername(username) {
    // Instagram username validation
    const usernameRegex = /^[a-zA-Z0-9._]{1,30}$/;
    return usernameRegex.test(username);
}

function scrollToResults() {
    const resultsSection = document.getElementById('resultsSection');
    if (resultsSection) {
        resultsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ===== RECENT SEARCHES =====
function addToRecentSearches(username) {
    let recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');

    // Remove if already exists
    recentSearches = recentSearches.filter(search => search !== username);

    // Add to beginning
    recentSearches.unshift(username);

    // Keep only last 5 searches
    recentSearches = recentSearches.slice(0, 5);

    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    updateRecentSearchesDisplay();
}

function updateRecentSearchesDisplay() {
    const recentSearchesContainer = document.getElementById('recentSearches');
    if (!recentSearchesContainer) return;

    const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');

    if (recentSearches.length === 0) {
        recentSearchesContainer.innerHTML = '<p class="text-muted">No recent searches</p>';
        return;
    }

    const searchesHTML = recentSearches.map(username => `
        <div class="recent-search-item">
            <a href="#" onclick="searchUsername('${username}')" class="text-decoration-none">
                <i class="fab fa-instagram me-2"></i>${username}
            </a>
        </div>
    `).join('');

    recentSearchesContainer.innerHTML = searchesHTML;
}

function searchUsername(username) {
    const usernameInput = document.getElementById('usernameInput');
    if (usernameInput) {
        usernameInput.value = username;
        handleSearch();
    }
}

// ===== LOADING OVERLAY =====
function showLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// ===== NOTIFICATIONS =====
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification-toast`;
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${getNotificationIcon(type)} me-2"></i>
            <span>${message}</span>
            <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        animation: slideInRight 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// ===== NEWSLETTER SUBSCRIPTION =====
function handleNewsletterSubscription(event) {
    const form = event.target.closest('form') || event.target.closest('.input-group').parentElement;
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput.value.trim();

    if (!email) {
        showNotification('Please enter your email address', 'warning');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    // Simulate subscription
    event.target.disabled = true;
    event.target.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';

    setTimeout(() => {
        showNotification('Successfully subscribed to newsletter!', 'success');
        emailInput.value = '';
        event.target.disabled = false;
        event.target.innerHTML = 'Subscribe';
    }, 1500);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== NAVBAR SCROLL EFFECT =====
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    }
}

// ===== BACK TO TOP BUTTON =====
function createBackToTopButton() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.className = 'btn btn-primary back-to-top-btn';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: none;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    document.body.appendChild(backToTopBtn);
    return backToTopBtn;
}

// ===== TOOLTIPS =====
function initializeTooltips() {
    // Initialize Bootstrap tooltips if available
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
}

// ===== LAZY LOADING =====
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ===== WINDOW RESIZE HANDLER =====
function handleWindowResize() {
    // Update Swiper if it exists
    if (window.trendingSwiper) {
        window.trendingSwiper.update();
    }

    // Update AOS if it exists
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', function (e) {
    // ESC key to close modals
    if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal.show');
        if (openModal) {
            const modal = bootstrap.Modal.getInstance(openModal);
            if (modal) {
                modal.hide();
            }
        }
    }

    // Enter key on search input
    if (e.key === 'Enter' && e.target.id === 'usernameInput') {
        e.preventDefault();
        handleSearch();
    }
});

// ===== PERFORMANCE MONITORING =====
function logPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
                console.log('DOM Content Loaded:', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart, 'ms');
            }, 0);
        });
    }
}

// Initialize performance monitoring
logPerformance();

// ===== ERROR HANDLING =====
window.addEventListener('error', function (e) {
    console.error('JavaScript Error:', e.error);
    // You could send this to an error tracking service
});

window.addEventListener('unhandledrejection', function (e) {
    console.error('Unhandled Promise Rejection:', e.reason);
    // You could send this to an error tracking service
});

// ===== EXPORT FOR OTHER MODULES =====
window.InStalkgram = {
    showNotification,
    showLoadingOverlay,
    hideLoadingOverlay,
    addToRecentSearches,
    searchUsername,
    isValidUsername,
    isValidEmail
};



function displayProfile(profile) {
    const profileInfo = document.getElementById("profileInfo");
    const resultsSection = document.getElementById("resultsSection");

    if (!profile || !profile.username) {
        profileInfo.innerHTML = "";
        resultsSection.style.display = "none";
        showNotification("Profile not found or private.", "error");
        return;
    }

    resultsSection.style.display = "block";

    profileInfo.innerHTML = `
        <div class="profile-header d-flex align-items-center mb-4">
            <img src="${profile.profilePicUrl}" alt="${profile.username}" class="profile-avatar rounded-circle me-4">
            <div>
                <h2 class="profile-username mb-1">${profile.username}</h2>
                <p class="profile-fullname text-muted">${profile.fullName || ''}</p>
                <div class="profile-stats d-flex mt-2">
                    <span class="me-3"><strong>${formatNumber(profile.postsCount)}</strong> Posts</span>
                    <span class="me-3"><strong>${formatNumber(profile.followersCount)}</strong> Followers</span>
                    <span><strong>${formatNumber(profile.followingCount)}</strong> Following</span>
                </div>
            </div>
        </div>
        <p class="profile-bio mb-4">${profile.biography || 'No biography available.'}</p>
    `;
}

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
}




function displayPosts(posts) {
    const storiesGrid = document.getElementById("storiesGrid");
    const reelsGrid = document.getElementById("reelsGrid");

    storiesGrid.innerHTML = "";
    reelsGrid.innerHTML = "";

    if (!posts || posts.length === 0) {
        storiesGrid.innerHTML = "<p class='text-muted'>No stories available</p>";
        reelsGrid.innerHTML = "<p class='text-muted'>No posts available</p>";
        return;
    }

    posts.forEach((post, index) => {
        const isVideo = post.postType === "video";
        const mediaUrl = post.mediaUrls[0]?.url;
        const thumbnailUrl = post.mediaUrls[0]?.thumbnail_url || mediaUrl;

        const postItem = document.createElement("div");
        postItem.className = "post-item";
        postItem.innerHTML = `
            <img src="${thumbnailUrl}" alt="Post thumbnail">
            <div class="media-type-indicator">
                <i class="fas fa-${isVideo ? "video" : "image"}"></i>
            </div>
            ${isVideo ? `
                <div class="video-play-overlay" title="Play Video">
                    <i class="fas fa-play"></i>
                </div>
            ` : ""}
            <div class="download-icon" title="Download">
                <i class="fas fa-download"></i>
            </div>
        `;

        if (isVideo) {
            const playButton = postItem.querySelector(".video-play-overlay");
            playButton.addEventListener("click", (e) => {
                e.stopPropagation();
                openModal(post);
            });
        }

        postItem.addEventListener("click", (e) => {
            if (!e.target.closest(".download-icon") && !e.target.closest(".video-play-overlay")) {
                openModal(post);
            }
        });

        postItem.querySelector(".download-icon").addEventListener("click", (e) => {
            e.stopPropagation();
            downloadMedia(post);
        });

        if (post.postType === "story") {
            storiesGrid.appendChild(postItem);
        } else {
            reelsGrid.appendChild(postItem);
        }
    });
}

function openModal(post) {
    const modal = document.getElementById("mediaModal");
    const mediaContainer = modal.querySelector("#mediaContainer");
    const downloadBtn = modal.querySelector("#downloadBtn");
    const shareBtn = modal.querySelector("#shareBtn");

    const isVideo = post.postType === "video";
    const mediaUrl = post.mediaUrls[0]?.url;

    mediaContainer.innerHTML = isVideo
        ? `<video src="${mediaUrl}" controls autoplay loop class="img-fluid"></video>`
        : `<img src="${mediaUrl}" alt="Post" class="img-fluid">`;

    downloadBtn.onclick = () => downloadMedia(post);
    // Share functionality can be added here if needed
    shareBtn.style.display = "none"; // Hide share button for now

    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

function downloadMedia(post) {
    showNotification("Starting download...", "info");
    try {
        const mediaUrl = post.mediaUrls[0]?.url;
        const isVideo = post.postType === "video";

        const link = document.createElement("a");
        link.href = mediaUrl;
        link.download = `${post.username}_${post.shortcode || Date.now()}.${isVideo ? "mp4" : "jpg"}`;
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showNotification("Download started!", "success");
    } catch (error) {
        console.error("Download failed:", error);
        showNotification("Download failed. You can try right-clicking the media and saving it.", "error");
    }
}

function stopVideo() {
    const videoElement = document.querySelector('#mediaContainer video');
    if (videoElement) {
        videoElement.pause();  // Pause the video
        videoElement.currentTime = 0;  // Reset to the start of the video
    }
}

