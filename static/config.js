// Runtime configuration for Vercel deployment
// This script sets up environment variables that can be accessed by the frontend

(function() {
    // Set global API configuration
    window.WELLNESS_CONFIG = {
        API_BASE_URL: 'https://web-production-fa83.up.railway.app',
        API_TIMEOUT: 30000,
        RETRY_ATTEMPTS: 3,
        ENVIRONMENT: 'production'
    };
    
    // Legacy support
    window.WELLNESS_API_URL = 'https://web-production-fa83.up.railway.app';
    
    console.log('Wellness app configuration loaded:', window.WELLNESS_CONFIG);
})();
