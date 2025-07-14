/**
 * Employee Wellness Chat Interface - Vercel Version
 * Updated for static deployment with environment-based API configuration
 */

class ChatInterface {
    constructor() {
        console.log('ChatInterface constructor called');
        console.log('Current URL:', window.location.href);
        console.log('URL pathname:', window.location.pathname);
        console.log('URL search:', window.location.search);
        
        // Get configuration from URL or environment
        const urlParams = WellnessRouter.getParametersFromURL();
        this.token = urlParams.token;
        this.companyName = urlParams.company;
        this.anonymousId = urlParams.anonymousId;
        this.teamName = urlParams.team;
        
        console.log('URL Parameters extracted:', urlParams);
        
        this.sessionActive = false;
        this.messageQueue = [];
        
        // API Configuration - Environment-based
        this.API_BASE_URL = this.getApiBaseUrl();
        
        console.log('Configuration loaded:');
        console.log('- Token available:', !!this.token);
        console.log('- Company name:', this.companyName);
        console.log('- Team name:', this.teamName);
        console.log('- API Base URL:', this.API_BASE_URL);
        
        // Validate token presence
        if (!this.token) {
            console.error('No token provided');
            WellnessRouter.navigateToError('missing_token', 'Access token is required to start a chat session.');
            return;
        }
        
        this.initializeElements();
        this.initializeEventListeners();
        this.initializeSession();
    }
    
    getApiBaseUrl() {
        // Check for global configuration first
        if (typeof window !== 'undefined' && window.WELLNESS_CONFIG && window.WELLNESS_CONFIG.API_BASE_URL) {
            return window.WELLNESS_CONFIG.API_BASE_URL;
        }
        
        // Check for environment variables (Vercel)
        if (typeof process !== 'undefined' && process.env && process.env.VITE_API_BASE_URL) {
            return process.env.VITE_API_BASE_URL;
        }
        
        // Check for window environment variables (Vercel runtime)
        if (typeof window !== 'undefined' && window.process && window.process.env && window.process.env.VITE_API_BASE_URL) {
            return window.process.env.VITE_API_BASE_URL;
        }
        
        // Check for legacy global config
        if (typeof window !== 'undefined' && window.WELLNESS_API_URL) {
            return window.WELLNESS_API_URL;
        }
        
        // Environment-based fallback
        if (typeof window !== 'undefined' && window.location) {
            // For development
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                return 'http://localhost:8000';
            }
            
            // For Vercel production deployment
            if (window.location.hostname.includes('.vercel.app') || window.location.hostname.includes('employee-wellness')) {
                return 'https://web-production-fa83.up.railway.app';
            }
        }
        
        // Default to Railway production URL
        return 'https://web-production-fa83.up.railway.app';
    }
    
    initializeElements() {
        console.log('Initializing elements...');
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.endChatButton = document.getElementById('endChatButton');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.endSessionModal = document.getElementById('endSessionModal');
        this.cancelEndSession = document.getElementById('cancelEndSession');
        this.confirmEndSession = document.getElementById('confirmEndSession');
        
        if (!this.chatMessages || !this.messageInput || !this.sendButton) {
            console.error('Required elements not found');
            return;
        }
        
        console.log('Elements initialized successfully');
    }
    
    initializeEventListeners() {
        console.log('Setting up event listeners...');
        
        // Message input events
        this.messageInput.addEventListener('input', () => this.handleInputChange());
        this.messageInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Send button
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // End chat button
        this.endChatButton.addEventListener('click', () => this.showEndSessionModal());
        
        // Modal events
        if (this.cancelEndSession) {
            this.cancelEndSession.addEventListener('click', () => this.hideEndSessionModal());
        }
        if (this.confirmEndSession) {
            this.confirmEndSession.addEventListener('click', () => this.endSession());
        }
        
        // Close modal on outside click
        if (this.endSessionModal) {
            this.endSessionModal.addEventListener('click', (e) => {
                if (e.target === this.endSessionModal) {
                    this.hideEndSessionModal();
                }
            });
        }
        
        console.log('Event listeners set up');
    }
    
    async initializeSession() {
        console.log('Initializing session with token validation...');
        console.log('Using API Base URL:', this.API_BASE_URL);
        console.log('Token:', this.token);
        console.log('Company:', this.companyName);
        this.updateSendButton();
        
        try {
            const response = await fetch(`${this.API_BASE_URL}/api/validate-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    token: this.token,
                    company_name: this.companyName
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                this.sessionActive = true;
                this.messageInput.focus();
                this.updateSendButton();
                console.log('Session initialized successfully');
            } else {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                throw new Error(errorData.error || 'Token validation failed');
            }
        } catch (error) {
            console.error('Session initialization failed:', error);
            console.error('API URL was:', this.API_BASE_URL);
            console.error('Token was:', this.token);
            console.error('Company was:', this.companyName);
            
            // Show a user-friendly error message
            this.showInitializationError(error);
        }
    }
    
    showInitializationError(error) {
        // Display error in the UI instead of redirecting immediately
        const errorMessage = document.createElement('div');
        errorMessage.className = 'initialization-error';
        errorMessage.innerHTML = `
            <div class="error-content">
                <h3>Connection Issue</h3>
                <p>Unable to connect to the wellness service.</p>
                <p><strong>Details:</strong> ${error.message}</p>
                <button onclick="location.reload()" class="retry-btn">Try Again</button>
                <button onclick="window.history.back()" class="back-btn">Go Back</button>
            </div>
        `;
        
        // Insert error message into chat container
        const chatContainer = document.querySelector('.chat-container');
        if (chatContainer) {
            chatContainer.appendChild(errorMessage);
        }
    }
    
    async checkApiHealth() {
        try {
            console.log('Checking API health at:', this.API_BASE_URL);
            const response = await fetch(`${this.API_BASE_URL}/ping`, {
                method: 'GET',
                timeout: 5000
            });
            
            if (response.ok) {
                console.log('✅ API health check passed');
                return true;
            } else {
                console.warn('⚠️ API health check failed with status:', response.status);
                return false;
            }
        } catch (error) {
            console.error('❌ API health check failed:', error);
            return false;
        }
    }
    
    handleInputChange() {
        this.autoResize();
        this.updateSendButton();
    }
    
    handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.sendMessage();
        }
    }
    
    autoResize() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
    }
    
    updateSendButton() {
        const hasText = this.messageInput.value.trim().length > 0;
        const canSend = hasText && this.sessionActive;
        
        this.sendButton.disabled = !canSend;
        this.sendButton.style.opacity = canSend ? '1' : '0.5';
    }
    
    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || !this.sessionActive) return;
        
        // Add user message to chat
        this.addMessage(message, 'user');
        this.messageInput.value = '';
        this.autoResize();
        this.updateSendButton();
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            const response = await fetch(`${this.API_BASE_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: this.token,
                    company_name: this.companyName,
                    message: message
                })
            });
            
            this.hideTypingIndicator();
            
            if (response.ok) {
                const data = await response.json();
                
                // Add AI response
                if (data.response) {
                    this.addMessage(data.response, 'assistant');
                }
                
                // Handle session analytics if present
                if (data.session_analytics) {
                    console.log('Session analytics:', data.session_analytics);
                }
                
            } else {
                throw new Error('Failed to send message');
            }
            
        } catch (error) {
            console.error('Error sending message:', error);
            this.hideTypingIndicator();
            
            // Add error message
            this.addMessage(
                "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
                'assistant',
                true
            );
        }
    }
    
    addMessage(content, sender, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message${isError ? ' error-message' : ''}`;
        
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-${sender === 'user' ? 'user' : 'robot'}"></i>
            </div>
            <div class="message-content">
                <div class="message-bubble">
                    <p>${this.formatMessage(content)}</p>
                </div>
                <div class="message-time">${timestamp}</div>
            </div>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Add entrance animation
        requestAnimationFrame(() => {
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translateY(20px)';
            messageDiv.style.transition = 'all 0.3s ease-out';
            
            requestAnimationFrame(() => {
                messageDiv.style.opacity = '1';
                messageDiv.style.transform = 'translateY(0)';
            });
        });
    }
    
    formatMessage(content) {
        // Basic formatting for line breaks and simple markdown-style formatting
        return content
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    }
    
    showTypingIndicator() {
        if (this.typingIndicator) {
            this.typingIndicator.style.display = 'flex';
            this.scrollToBottom();
        }
    }
    
    hideTypingIndicator() {
        if (this.typingIndicator) {
            this.typingIndicator.style.display = 'none';
        }
    }
    
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    showEndSessionModal() {
        if (this.endSessionModal) {
            this.endSessionModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }
    
    hideEndSessionModal() {
        if (this.endSessionModal) {
            this.endSessionModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }
    
    async endSession() {
        console.log('Ending session...');
        
        try {
            const response = await fetch(`${this.API_BASE_URL}/api/end-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: this.token,
                    company_name: this.companyName
                })
            });
            
            if (response.ok) {
                console.log('Session ended successfully');
                WellnessRouter.navigateToThankYou();
            } else {
                throw new Error('Failed to end session properly');
            }
            
        } catch (error) {
            console.error('Error ending session:', error);
            // Still navigate to thank you page even if API call fails
            WellnessRouter.navigateToThankYou();
        }
    }
}

// Initialize chat interface when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Ensure router is loaded first
    if (window.WellnessRouter) {
        window.chatInterface = new ChatInterface();
    } else {
        // Wait for router to load
        const checkRouter = setInterval(() => {
            if (window.WellnessRouter) {
                clearInterval(checkRouter);
                window.chatInterface = new ChatInterface();
            }
        }, 100);
    }
});

// Export for debugging
window.ChatInterface = ChatInterface;
