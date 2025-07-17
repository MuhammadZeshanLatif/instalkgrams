// File: scripts/api.js

const API_URL = 'https://instalkgram-backend.vercel.app';

async function fetchProfile(username) {
    try {
        const res = await fetch(`${API_URL}/stalk/profile?username=${username}`);
        if (!res.ok) {
            // Agar profile nahi milti ya koi aur error ata hai
            const errorData = await res.json();
            throw new Error(errorData.message || `Failed to fetch profile: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error("API Error in fetchProfile:", error);
        throw error; // Error ko aage pass kar dein take UI mein show ho sake
    }
}

async function fetchPosts(username) {
    try {
        const res = await fetch(`${API_URL}/stalk/posts?username=${username}`);
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || `Failed to fetch posts: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        console.error("API Error in fetchPosts:", error);
        throw error;
    }
}

