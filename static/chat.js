class ChatInterface {
    constructor() {
        console.log('ChatInterface constructor called');
        
        // Extract company and token from URL path
        this.extractUrlParameters();
        
        this.sessionActive = false;
        this.messageQueue = [];
        
        // API Configuration - Railway Backend
        this.API_BASE_URL = 'https://web-production-fa83.up.railway.app';
        
        console.log('Token available:', !!this.token);
        console.log('Company name:', this.companyName);
        console.log('API Base URL:', this.API_BASE_URL);
        
        // Validate token before proceeding
        if (!this.token || !this.companyName) {
            this.showError('Invalid or missing access token. Please check your link.');
            return;
        }
        
        this.initializeElements();
        this.initializeEventListeners();
        this.initializeSession();
    }
    
    extractUrlParameters() {
        // Extract from URL path: /{company-name}/chat/{token}
        const pathParts = window.location.pathname.split('/').filter(part => part);
        
        if (pathParts.length >= 3 && pathParts[1] === 'chat') {
            this.companyName = pathParts[0];
            this.token = pathParts[2];
            this.anonymousId = 'anon_' + Math.random().toString(36).substr(2, 9);
        } else {
            // Fallback: try to get from query parameters
            const urlParams = new URLSearchParams(window.location.search);
            this.token = urlParams.get('token');
            this.companyName = urlParams.get('company') || 'Unknown Company';
            this.anonymousId = urlParams.get('id') || 'anon_' + Math.random().toString(36).substr(2, 9);
        }
        
        console.log('Extracted URL parameters:', {
            companyName: this.companyName,
            token: this.token ? 'present' : 'missing',
            anonymousId: this.anonymousId
        });
    }
    
    showError(message) {
        document.body.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #f5f5f5;">
                <div style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; max-width: 500px;">
                    <div style="color: #e74c3c; font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                    <h2 style="color: #2c3e50; margin-bottom: 1rem;">Access Error</h2>
                    <p style="color: #666; margin-bottom: 1.5rem;">${message}</p>
                    <p style="color: #999; font-size: 0.9rem;">Please contact your administrator for a valid access link.</p>
                </div>
            </div>
        `;
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
        
        // Update company name in UI if element exists
        const companyElement = document.getElementById('companyName');
        if (companyElement) {
            companyElement.textContent = this.companyName;
        }
        
        console.log('Elements initialized');
    }
    
    initializeEventListeners() {
        console.log('Setting up event listeners...');
        
        if (this.sendButton) {
            this.sendButton.addEventListener('click', () => this.sendMessage());
        }
        
        if (this.messageInput) {
            this.messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
            
            this.messageInput.addEventListener('input', () => {
                this.sendButton.disabled = !this.messageInput.value.trim();
            });
        }
        
        if (this.endChatButton) {
            this.endChatButton.addEventListener('click', () => this.showEndSessionModal());
        }
        
        if (this.cancelEndSession) {
            this.cancelEndSession.addEventListener('click', () => this.hideEndSessionModal());
        }
        
        if (this.confirmEndSession) {
            this.confirmEndSession.addEventListener('click', () => this.endSession());
        }
        
        console.log('Event listeners set up');
    }
    
    async initializeSession() {
        console.log('Initializing session...');
        try {
            const response = await fetch(`${this.API_BASE_URL}/chat/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: this.token,
                    company_name: this.companyName,
                    anonymous_id: this.anonymousId
                })
            });
            
            if (response.ok) {
                this.sessionActive = true;
                console.log('Session initialized successfully');
                this.updateUIForActiveSession();
            } else {
                console.error('Failed to initialize session:', response.statusText);
                this.showError('Failed to start chat session. Please try again.');
            }
        } catch (error) {
            console.error('Error initializing session:', error);
            this.showError('Connection error. Please check your internet connection and try again.');
        }
    }
    
    updateUIForActiveSession() {
        if (this.messageInput) {
            this.messageInput.disabled = false;
            this.messageInput.placeholder = "Type your message here...";
        }
        if (this.sendButton) {
            this.sendButton.disabled = true; // Will be enabled when user types
        }
    }
    
    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || !this.sessionActive) return;
        
        // Add user message to UI
        this.addMessage(message, 'user');
        this.messageInput.value = '';
        this.sendButton.disabled = true;
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            const response = await fetch(`${this.API_BASE_URL}/chat/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: this.token,
                    message: message,
                    anonymous_id: this.anonymousId
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                this.hideTypingIndicator();
                this.addMessage(data.response, 'assistant');
            } else {
                this.hideTypingIndicator();
                this.addMessage('Sorry, I encountered an error. Please try again.', 'assistant');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            this.hideTypingIndicator();
            this.addMessage('Connection error. Please check your internet connection.', 'assistant');
        }
    }
    
    addMessage(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = type === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.innerHTML = `<p>${content}</p>`;
        
        const time = document.createElement('div');
        time.className = 'message-time';
        time.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        messageContent.appendChild(bubble);
        messageContent.appendChild(time);
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    showTypingIndicator() {
        if (this.typingIndicator) {
            this.typingIndicator.style.display = 'flex';
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }
    }
    
    hideTypingIndicator() {
        if (this.typingIndicator) {
            this.typingIndicator.style.display = 'none';
        }
    }
    
    showEndSessionModal() {
        if (this.endSessionModal) {
            this.endSessionModal.style.display = 'flex';
        }
    }
    
    hideEndSessionModal() {
        if (this.endSessionModal) {
            this.endSessionModal.style.display = 'none';
        }
    }
    
    async endSession() {
        try {
            await fetch(`${this.API_BASE_URL}/chat/end`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: this.token,
                    anonymous_id: this.anonymousId
                })
            });
        } catch (error) {
            console.error('Error ending session:', error);
        }
        
        // Redirect to thank you page or show completion message
        document.body.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #f5f5f5;">
                <div style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; max-width: 500px;">
                    <div style="color: #27ae60; font-size: 3rem; margin-bottom: 1rem;">✅</div>
                    <h2 style="color: #2c3e50; margin-bottom: 1rem;">Session Complete</h2>
                    <p style="color: #666; margin-bottom: 1.5rem;">Thank you for using our wellness chat service. Your feedback helps us improve workplace wellness.</p>
                    <p style="color: #999; font-size: 0.9rem;">You can safely close this window.</p>
                </div>
            </div>
        `;
    }
}

// Auto-initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing ChatInterface...');
    new ChatInterface();
});
