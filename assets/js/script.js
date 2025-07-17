// File: scripts/script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Element References ---
    const searchButton = document.getElementById('searchBtn');
    const usernameInput = document.getElementById('usernameInput');
    const postsGrid = document.getElementById('reelsGrid');
    const modal = document.getElementById('mediaModal');
    const profileSection = document.getElementById('resultsSection');
    const postsSection = document.getElementById('resultsSection');
    
    let mediaItems = []; // Store fetched posts data

    // --- Event Listeners ---
    if (searchButton) {
        searchButton.addEventListener('click', handleSearch);
    }
    if (usernameInput) {
        usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }

    // --- Main Search Function ---
    async function handleSearch() {
        const username = usernameInput.value.trim();
        if (!username) {
            showToast('Please enter a username.', 'warning');
            return;
        }
        
        showLoading(true);
        // Hide previous results
        profileSection.classList.add('hidden');
        postsSection.classList.add('hidden');

        try {
            // Fetch profile and posts data simultaneously
            const [profileData, postsData] = await Promise.all([
                fetchProfile(username),
                fetchPosts(username)
            ]);

            // Display data
            displayProfile(profileData);
            mediaItems = postsData.posts || [];
            displayPosts(mediaItems);
            
            // Smooth scroll to profile section
            setTimeout(() => {
                profileSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 300);

        } catch (error) {
            console.error('Search failed:', error);
            showToast(error.message || 'Could not find the user. Please check the username.', 'error');
        } finally {
            showLoading(false);
        }
    }

    // --- UI Display Functions ---
    function displayProfile(profile) {
        if (!profileSection) return;
        
        profileSection.style.display = 'block';
        const profileInfo = document.getElementById('profileInfo');
        if (!profileInfo) return;
        
        profileInfo.innerHTML = `
            <div class="profile-avatar"><img src="${profile.profilePicUrl}" alt="${profile.username}"></div>
            <div class="profile-details">
                <h2 class="profile-username">@${profile.username}</h2>
                <p class="profile-fullname"><strong>${profile.fullName || ''}</strong></p>
                <div class="profile-stats">
                    <span><strong>${formatNumber(profile.postsCount)}</strong> posts</span>
                    <span><strong>${formatNumber(profile.followersCount)}</strong> followers</span>
                    <span><strong>${formatNumber(profile.followingCount)}</strong> following</span>
                </div>
                <p class="profile-bio">${profile.biography || ''}</p>
            </div>
        `;
    }

    function displayPosts(posts) {
        if (!postsSection) return;
        
        postsSection.style.display = 'block';
        const storiesGrid = document.getElementById('storiesGrid');
        const reelsGrid = document.getElementById('reelsGrid');
        
        if (storiesGrid) storiesGrid.innerHTML = '';
        if (reelsGrid) reelsGrid.innerHTML = '';

        if (posts.length === 0) {
            if (reelsGrid) reelsGrid.innerHTML = '<p class="no-posts">This user has no posts or their account is private.</p>';
            return;
        }

        posts.forEach((post, index) => {
            const isVideo = post.postType === 'video';
            const media = post.mediaUrls[0] || {};
            const thumbnailUrl = media.thumbnail_url || media.url;

            const postItem = document.createElement('div');
            postItem.className = 'post-item';
            postItem.innerHTML = `
                <img src="${thumbnailUrl}" alt="Post thumbnail">
                <div class="media-type-indicator">
                    <i class="fas fa-${isVideo ? 'video' : 'image'}"></i>
                </div>
                ${isVideo ? `
                    <div class="video-play-overlay" title="Play Video">
                        <i class="fas fa-play"></i>
                    </div>
                ` : ''}
                <div class="download-icon" title="Download">
                    <i class="fas fa-download"></i>
                </div>
            `;
            
            // Handle video play button click
            if (isVideo) {
                const playButton = postItem.querySelector('.video-play-overlay');
                if (playButton) {
                    playButton.addEventListener('click', (e) => {
                        e.stopPropagation();
                        openModal(index);
                    });
                }
            }
            
            // Handle post click (excluding download icon)
            postItem.addEventListener('click', (e) => {
                if (!e.target.closest('.download-icon') && !e.target.closest('.video-play-overlay')) {
                    openModal(index);
                }
            });
            
            // Handle download from grid
            const downloadIcon = postItem.querySelector('.download-icon');
            if (downloadIcon) {
                downloadIcon.addEventListener('click', (e) => {
                    e.stopPropagation();
                    downloadMedia(post);
                });
            }

            if (reelsGrid) {
                reelsGrid.appendChild(postItem);
            }
        });
    }

    // --- Modal (Popup) Functions ---
    function openModal(index) {
        const post = mediaItems[index];
        if (!post) return;

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        const isVideo = post.postType === 'video';
        const mediaUrl = post.mediaUrls[0]?.url;

        const mediaContainer = modal.querySelector('.media-container');
        mediaContainer.innerHTML = isVideo
            ? `<video src="${mediaUrl}" controls autoplay></video>`
            : `<img src="${mediaUrl}" alt="Post">`;

        modal.querySelector('.media-caption').innerHTML = post.caption || 'No caption available.';

        modal.querySelector('.download-btn').onclick = () => downloadMedia(post);
        
        const shareBtn = modal.querySelector('.share-btn');
        const shareOptions = modal.querySelector('.share-options');
        shareBtn.onclick = () => shareOptions.classList.toggle('hidden');
        
        modal.querySelectorAll('.share-option').forEach(btn => {
            btn.onclick = () => shareMedia(btn.dataset.platform, post.shortcode);
        });
    }

    function closeModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        const video = modal.querySelector('video');
        if (video) {
            video.pause();
            video.src = '';
        }
        // Hide share options when closing modal
        const shareOptions = modal.querySelector('.share-options');
        shareOptions.classList.add('hidden');
    }
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // --- Utility Functions ---
    async function downloadMedia(post) {
        showToast('Starting download...', 'info');
        try {
            const mediaUrl = post.mediaUrls[0]?.url;
            const isVideo = post.postType === 'video';
            
            // Create a temporary link to download the file
            const link = document.createElement('a');
            link.href = mediaUrl;
            link.download = `${usernameInput.value.trim()}_${post.shortcode || Date.now()}.${isVideo ? 'mp4' : 'jpg'}`;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showToast('Download started!', 'success');
        } catch (error) {
            console.error('Download failed:', error);
            showToast('Download failed. You can try right-clicking the media and saving it.', 'error');
        }
    }

    function shareMedia(platform, shortcode) {
        const url = `https://www.instagram.com/p/${shortcode}/`;
        const text = "Check out this Instagram post!";
        let shareUrl;

        switch (platform) {
            case 'facebook': 
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'twitter': 
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
                break;
            case 'whatsapp': 
                shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
                break;
            case 'copy':
                navigator.clipboard.writeText(url).then(() => {
                    showToast('Link copied to clipboard!', 'success');
                }).catch(() => {
                    showToast('Could not copy link. Please copy manually.', 'error');
                });
                return;
        }
        
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
            showToast('Opening share window...', 'info');
        }
    }

    function showLoading(isLoading) {
        document.getElementById('loadingSpinner').classList.toggle('hidden', !isLoading);
    }

    function showToast(message, type = 'info') {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(toast => toast.remove());
        
        // Create new toast
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Show toast with animation
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    function formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num;
    }
});

