// Blog JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animations
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }

    // Back to top button functionality
    initBackToTop();
    
    // Search functionality
    initBlogSearch();
    
    // Category filtering
    initCategoryFilter();
    
    // Load more functionality
    initLoadMore();
    
    // Newsletter subscription
    initNewsletterForm();
    
    // Social sharing
    initSocialSharing();
    
    // Reading progress indicator
    initReadingProgress();
    
    // Smooth scrolling for table of contents
    initSmoothScrolling();
});

// Back to top button
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Blog search functionality
function initBlogSearch() {
    const searchInput = document.getElementById('blogSearch');
    const blogCards = document.querySelectorAll('.blog-card');
    
    if (searchInput && blogCards.length > 0) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            blogCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const content = card.querySelector('p').textContent.toLowerCase();
                const category = card.querySelector('.blog-category').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || content.includes(searchTerm) || category.includes(searchTerm)) {
                    card.closest('.col-md-6').style.display = 'block';
                } else {
                    card.closest('.col-md-6').style.display = 'none';
                }
            });
            
            // Show "no results" message if needed
            const visibleCards = Array.from(blogCards).filter(card => 
                card.closest('.col-md-6').style.display !== 'none'
            );
            
            if (visibleCards.length === 0 && searchTerm.length > 0) {
                showNoResultsMessage();
            } else {
                hideNoResultsMessage();
            }
        });
    }
}

// Category filtering
function initCategoryFilter() {
    const categoryLinks = document.querySelectorAll('[data-category]');
    const blogCards = document.querySelectorAll('.blog-card');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            
            // Remove active class from all category links
            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Filter blog cards
            blogCards.forEach(card => {
                const cardCategory = card.querySelector('.blog-category').textContent.toLowerCase();
                
                if (category === 'all' || cardCategory.includes(category)) {
                    card.closest('.col-md-6').style.display = 'block';
                } else {
                    card.closest('.col-md-6').style.display = 'none';
                }
            });
        });
    });
}

// Load more functionality
function initLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Simulate loading more articles
            this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                // In a real application, you would fetch more articles from the server
                this.innerHTML = '<i class="fas fa-plus me-2"></i>Load More Articles';
                this.disabled = false;
                
                // Show success message
                showNotification('More articles loaded successfully!', 'success');
            }, 2000);
        });
    }
}

// Newsletter subscription
function initNewsletterForm() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const submitBtn = this.querySelector('button[type="submit"]');
            const email = emailInput.value;
            
            if (validateEmail(email)) {
                // Simulate subscription
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    submitBtn.innerHTML = 'Subscribe';
                    submitBtn.disabled = false;
                    emailInput.value = '';
                    
                    showNotification('Successfully subscribed to newsletter!', 'success');
                }, 1500);
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    });
}

// Social sharing
function initSocialSharing() {
    const shareButtons = document.querySelectorAll('.social-share a');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const platform = this.querySelector('i').classList.contains('fa-twitter') ? 'twitter' :
                           this.querySelector('i').classList.contains('fa-facebook') ? 'facebook' :
                           this.querySelector('i').classList.contains('fa-linkedin') ? 'linkedin' : 'copy';
            
            const url = window.location.href;
            const title = document.title;
            
            switch(platform) {
                case 'twitter':
                    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank', 'width=600,height=400');
                    break;
                case 'facebook':
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
                    break;
                case 'linkedin':
                    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
                    break;
                case 'copy':
                    copyToClipboard(url);
                    showNotification('Link copied to clipboard!', 'success');
                    break;
            }
        });
    });
}

// Reading progress indicator
function initReadingProgress() {
    const article = document.querySelector('.article-content');
    
    if (article) {
        // Create progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.innerHTML = '<div class="reading-progress-bar"></div>';
        document.body.appendChild(progressBar);
        
        // Add CSS for progress bar
        const style = document.createElement('style');
        style.textContent = `
            .reading-progress {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 3px;
                background: rgba(225, 48, 108, 0.1);
                z-index: 9999;
            }
            .reading-progress-bar {
                height: 100%;
                background: linear-gradient(135deg, #E1306C, #405DE6);
                width: 0%;
                transition: width 0.3s ease;
            }
        `;
        document.head.appendChild(style);
        
        // Update progress on scroll
        window.addEventListener('scroll', function() {
            const articleTop = article.offsetTop;
            const articleHeight = article.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollTop = window.pageYOffset;
            
            const progress = Math.min(100, Math.max(0, 
                ((scrollTop - articleTop + windowHeight) / articleHeight) * 100
            ));
            
            progressBar.querySelector('.reading-progress-bar').style.width = progress + '%';
        });
    }
}

// Smooth scrolling for table of contents
function initSmoothScrolling() {
    const tocLinks = document.querySelectorAll('.table-of-contents a[href^="#"]');
    
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 100; // Account for fixed header
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Utility functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification-toast');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification-toast alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        border-radius: 10px;
    `;
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

function showNoResultsMessage() {
    const existingMessage = document.querySelector('.no-results-message');
    if (existingMessage) return;
    
    const blogGrid = document.querySelector('.blog-posts .row .col-lg-8 .row');
    if (blogGrid) {
        const message = document.createElement('div');
        message.className = 'no-results-message col-12 text-center py-5';
        message.innerHTML = `
            <i class="fas fa-search fa-3x text-muted mb-3"></i>
            <h4>No articles found</h4>
            <p class="text-muted">Try adjusting your search terms or browse our categories.</p>
        `;
        blogGrid.appendChild(message);
    }
}

function hideNoResultsMessage() {
    const message = document.querySelector('.no-results-message');
    if (message) {
        message.remove();
    }
}

// Blog post interactions
function initBlogPostInteractions() {
    // Like button functionality
    const likeButtons = document.querySelectorAll('.like-btn');
    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const count = this.querySelector('.like-count');
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.classList.add('liked');
                count.textContent = parseInt(count.textContent) + 1;
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.classList.remove('liked');
                count.textContent = parseInt(count.textContent) - 1;
            }
        });
    });
    
    // Bookmark functionality
    const bookmarkButtons = document.querySelectorAll('.bookmark-btn');
    bookmarkButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.classList.add('bookmarked');
                showNotification('Article bookmarked!', 'success');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.classList.remove('bookmarked');
                showNotification('Bookmark removed!', 'info');
            }
        });
    });
}

// Initialize blog post interactions if on article page
if (document.querySelector('.article-content')) {
    document.addEventListener('DOMContentLoaded', initBlogPostInteractions);
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
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
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if supported
if ('IntersectionObserver' in window) {
    document.addEventListener('DOMContentLoaded', initLazyLoading);
}

// Blog analytics (placeholder for real analytics)
function trackBlogEvent(eventName, data = {}) {
    // In a real application, you would send this to your analytics service
    console.log('Blog Event:', eventName, data);
    
    // Example: Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, data);
    }
}

// Track blog interactions
document.addEventListener('DOMContentLoaded', function() {
    // Track article views
    if (document.querySelector('.article-content')) {
        trackBlogEvent('article_view', {
            article_title: document.title,
            article_url: window.location.href
        });
    }
    
    // Track search usage
    const searchInput = document.getElementById('blogSearch');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            if (this.value.length > 2) {
                trackBlogEvent('blog_search', {
                    search_term: this.value
                });
            }
        }, 500));
    }
});

// Debounce utility function
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

