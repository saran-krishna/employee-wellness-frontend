class ChatInterface {
    constructor() {
        console.log('ChatInterface constructor called');
        this.token = token; // From template
        this.companyName = companyName; // From template
        this.anonymousId = anonymousId; // From template
        this.sessionActive = false;
        this.messageQueue = [];
        
        // API Configuration - Railway Backend
        this.API_BASE_URL = 'https://web-production-fa83.up.railway.app';
        
        console.log('Token available:', !!this.token);
        console.log('Company name:', this.companyName);
        console.log('API Base URL:', this.API_BASE_URL);
        
        this.initializeElements();
        this.initializeEventListeners();
        this.initializeSession();
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
        
        console.log('Elements found:', {
            messageInput: !!this.messageInput,
            sendButton: !!this.sendButton,
            chatMessages: !!this.chatMessages
        });
    }
    
    initializeEventListeners() {
        console.log('Setting up event listeners...');
        // Send message on button click
        this.sendButton.addEventListener('click', () => {
            console.log('Send button clicked!');
            this.sendMessage();
        });
        
        // Send message on Enter (but not Shift+Enter)
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                console.log('Enter key pressed, sending message');
                this.sendMessage();
            }
        });
        
        // Auto-resize textarea and enable/disable send button
        this.messageInput.addEventListener('input', () => {
            this.autoResizeTextarea();
            this.updateSendButton();
        });
        
        // End chat button
        this.endChatButton.addEventListener('click', () => this.showEndSessionModal());
        
        // Modal buttons
        this.cancelEndSession.addEventListener('click', () => this.hideEndSessionModal());
        this.confirmEndSession.addEventListener('click', () => this.endSession());
        
        // Close modal on overlay click
        this.endSessionModal.addEventListener('click', (e) => {
            if (e.target === this.endSessionModal) {
                this.hideEndSessionModal();
            }
        });
    }
    
    async initializeSession() {
        // Initialize send button state
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
                this.updateSendButton(); // Ensure send button state is updated after session is active
            } else {
                throw new Error('Token validation failed');
            }
        } catch (error) {
            console.error('Session initialization failed:', error);
            this.showError('Failed to initialize session. Please try refreshing the page.');
        }
    }
    
    async sendMessage() {
        console.log('sendMessage called');
        const message = this.messageInput.value.trim();
        console.log('Message:', message, 'Session active:', this.sessionActive);
        
        if (!message || !this.sessionActive) {
            console.log('Cannot send: no message or session not active');
            return;
        }
        
        // Disable input while sending
        this.setInputState(false);
        
        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Clear input
        this.messageInput.value = '';
        this.autoResizeTextarea();
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
                    message: message,
                    token: this.token,
                    company_name: this.companyName
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                this.hideTypingIndicator();
                this.addMessage(data.response, 'bot');
            } else {
                throw new Error('Failed to get response');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            this.hideTypingIndicator();
            this.addMessage('I apologize, but I\'m having trouble responding right now. Please try again.', 'bot', true);
        } finally {
            this.setInputState(true);
            this.messageInput.focus();
        }
    }
    
    addMessage(content, sender, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender === 'bot' ? 'assistant-message' : 'user-message'}`;
        
        // Create avatar
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        const icon = document.createElement('i');
        if (sender === 'bot') {
            icon.className = 'fas fa-robot';
        } else {
            icon.className = 'fas fa-user';
        }
        avatar.appendChild(icon);
        
        // Create message content container
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Create message bubble
        const messageBubble = document.createElement('div');
        messageBubble.className = `message-bubble ${isError ? 'error-message' : ''}`;
        
        // Convert line breaks to paragraphs
        const paragraphs = content.split('\n').filter(p => p.trim());
        paragraphs.forEach(paragraph => {
            const p = document.createElement('p');
            p.textContent = paragraph;
            messageBubble.appendChild(p);
        });
        
        // Create timestamp
        const timestamp = document.createElement('div');
        timestamp.className = 'message-time';
        const now = new Date();
        timestamp.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageContent.appendChild(messageBubble);
        messageContent.appendChild(timestamp);
        
        // Append elements based on sender
        if (sender === 'user') {
            messageDiv.appendChild(messageContent);
            messageDiv.appendChild(avatar);
        } else {
            messageDiv.appendChild(avatar);
            messageDiv.appendChild(messageContent);
        }
        
        this.chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        this.scrollToBottom();
    }
    
    updateSendButton() {
        const hasText = this.messageInput.value.trim().length > 0;
        const shouldEnable = hasText && this.sessionActive;
        this.sendButton.disabled = !shouldEnable;
    }
    
    showTypingIndicator() {
        this.typingIndicator.style.display = 'flex';
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        this.typingIndicator.style.display = 'none';
    }
    
    setInputState(enabled) {
        this.messageInput.disabled = !enabled;
        
        if (enabled) {
            this.messageInput.focus();
            this.updateSendButton(); // Use updateSendButton to properly control send button state
        } else {
            this.sendButton.disabled = true; // Always disable when input is disabled
        }
    }
    
    autoResizeTextarea() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
    }
    
    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }
    
    showEndSessionModal() {
        this.endSessionModal.style.display = 'flex';
    }
    
    hideEndSessionModal() {
        this.endSessionModal.style.display = 'none';
    }
    
    async endSession() {
        console.log('Ending session...');
        this.hideEndSessionModal();
        
        // Disable all inputs
        this.setInputState(false);
        
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
                console.log('Session ended successfully, redirecting...');
                // Mark session as inactive
                this.sessionActive = false;
                // Redirect to thank you page
                window.location.href = '/thank-you';
            } else {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to end session');
            }
        } catch (error) {
            console.error('Error ending session:', error);
            // Show error but still redirect after a delay since we want to end the session
            alert('Session ended. Thank you for using the wellness chat.');
            setTimeout(() => {
                window.location.href = '/thank-you';
            }, 1000);
        }
    }
    
    showError(message) {
        this.addMessage(message, 'bot', true);
    }
}

// Initialize chat interface when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing ChatInterface...');
    try {
        new ChatInterface();
        console.log('ChatInterface initialized successfully');
    } catch (error) {
        console.error('Error initializing ChatInterface:', error);
    }
});

// Handle page visibility to maintain session
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Page became visible - could validate session here if needed
    }
});

// Warn user before leaving page
window.addEventListener('beforeunload', (e) => {
    const chat = document.querySelector('.chat-container');
    if (chat && window.location.pathname.includes('/chat/')) {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? Your chat session will be lost.';
        return e.returnValue;
    }
});
