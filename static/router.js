/**
 * Client-side router for Employee Wellness Chat
 * Handles URL parsing and page navigation for Vercel deployment
 */

class WellnessRouter {
    constructor() {
        this.init();
    }

    init() {
        // Check if we're on the right page based on URL
        const path = window.location.pathname;
        const urlParams = new URLSearchParams(window.location.search);
        
        console.log('Router initialized for path:', path);
        
        // Route to appropriate page if needed
        this.handleRouting(path, urlParams);
    }

    handleRouting(path, urlParams) {
        const pathSegments = path.split('/').filter(segment => segment);
        
        console.log('Handling route:', path, pathSegments);
        
        // Root path - stay on index
        if (pathSegments.length === 0) {
            console.log('On root page');
            return;
        }

        // Company/chat/token pattern
        if (pathSegments.length >= 3 && pathSegments[1] === 'chat') {
            const companyName = pathSegments[0];
            const token = pathSegments[2];
            
            console.log('Chat route detected:', { companyName, token });
            
            // Check if we're already on the right page
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            
            // Check if we need to redirect to welcome page first
            if (pathSegments.length === 3) {
                // This is /{company}/chat/{token} - should show welcome
                if (currentPage !== 'welcome.html') {
                    this.redirectToWelcome(companyName, token, urlParams);
                }
            } else if (pathSegments[3] === 'session') {
                // This is /{company}/chat/{token}/session - should show chat
                if (currentPage !== 'chat.html') {
                    this.ensureChatPage(companyName, token, urlParams);
                }
            }
            return;
        }

        // Other routes - let them handle themselves
        console.log('Other route, no action needed');
    }

    redirectToWelcome(companyName, token, urlParams) {
        // If we're already on welcome.html, don't redirect
        if (window.location.pathname.includes('welcome.html')) {
            return;
        }
        
        // Build welcome URL with parameters
        const welcomeUrl = new URL('/welcome.html', window.location.origin);
        welcomeUrl.searchParams.set('company', companyName);
        welcomeUrl.searchParams.set('token', token);
        
        // Preserve any additional parameters
        for (const [key, value] of urlParams) {
            welcomeUrl.searchParams.set(key, value);
        }
        
        console.log('Redirecting to welcome:', welcomeUrl.href);
        window.location.href = welcomeUrl.href;
    }

    ensureChatPage(companyName, token, urlParams) {
        // If we're not on chat.html, redirect there
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        if (currentPage !== 'chat.html') {
            const chatUrl = new URL('/chat.html', window.location.origin);
            chatUrl.searchParams.set('company', companyName);
            chatUrl.searchParams.set('token', token);
            
            // Preserve any additional parameters
            for (const [key, value] of urlParams) {
                chatUrl.searchParams.set(key, value);
            }
            
            console.log('Redirecting to chat page:', chatUrl.href);
            window.location.href = chatUrl.href;
        }
    }

    // Utility methods for other scripts to use
    static getCompanyFromURL() {
        const pathSegments = window.location.pathname.split('/').filter(segment => segment);
        const urlParams = new URLSearchParams(window.location.search);
        
        // Priority: URL path > query parameter > default
        if (pathSegments.length > 0 && pathSegments[0] && pathSegments[0] !== 'index.html') {
            return pathSegments[0];
        }
        return urlParams.get('company') || 'demo';
    }

    static getTokenFromURL() {
        const pathSegments = window.location.pathname.split('/').filter(segment => segment);
        const urlParams = new URLSearchParams(window.location.search);
        
        // Priority: URL path > query parameter > empty
        if (pathSegments.length >= 3 && pathSegments[1] === 'chat') {
            return pathSegments[2];
        }
        return urlParams.get('token') || '';
    }

    static getParametersFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const pathSegments = window.location.pathname.split('/').filter(segment => segment);
        
        // Handle different URL formats:
        // 1. Query parameters (from Vercel rewrites): ?company=demo&token=123
        // 2. Path parameters (from direct URLs): /demo/chat/123
        
        let company, token, anonymousId, team, teamGreeting;
        
        // Priority 1: Query parameters (most reliable for Vercel)
        if (urlParams.get('company')) {
            company = urlParams.get('company');
            token = urlParams.get('token');
        }
        // Priority 2: Path parsing (for direct URLs)
        else if (pathSegments.length >= 3 && pathSegments[1] === 'chat') {
            company = pathSegments[0];
            token = pathSegments[2];
        }
        // Priority 3: Defaults
        else {
            company = 'demo';
            token = '';
        }
        
        return {
            company: company || 'demo',
            token: token || '',
            anonymousId: urlParams.get('anonymous_id') || 'anon_' + Date.now(),
            team: urlParams.get('team') || 'General',
            teamGreeting: urlParams.get('team_greeting') || 'Welcome to Your Wellness Chat'
        };
    }

    // Navigation helpers
    static navigateToChat(companyName, token, params = {}) {
        const chatUrl = new URL('/chat.html', window.location.origin);
        chatUrl.searchParams.set('company', companyName);
        chatUrl.searchParams.set('token', token);
        
        // Add additional parameters
        Object.entries(params).forEach(([key, value]) => {
            if (value) chatUrl.searchParams.set(key, value);
        });
        
        window.location.href = chatUrl.href;
    }

    static navigateToThankYou() {
        window.location.href = '/thank-you.html';
    }

    static navigateToError(errorType, message = '') {
        const errorUrl = new URL('/error.html', window.location.origin);
        if (errorType) errorUrl.searchParams.set('error', errorType);
        if (message) errorUrl.searchParams.set('message', message);
        
        window.location.href = errorUrl.href;
    }
}

// Initialize router when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.wellnessRouter = new WellnessRouter();
});

// Export for use in other scripts
window.WellnessRouter = WellnessRouter;
