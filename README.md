# Employee Wellness Chat - Frontend

This is the frontend application for the Employee Wellness Chat system, optimized for deployment on Vercel.

## Architecture

- **Static HTML/CSS/JS** - No server-side rendering required
- **Client-side routing** - Handles URL parsing and navigation
- **Environment-based API configuration** - Supports multiple backend environments
- **Responsive design** - Works on desktop and mobile devices

## Deployment

### Vercel Deployment

1. **Create new Vercel project** from this directory
2. **Set environment variables** in Vercel dashboard:
   - `VITE_API_BASE_URL`: Your Railway backend URL
3. **Deploy** - Vercel will automatically deploy when you push to Git

### Environment Variables

```bash
VITE_API_BASE_URL=https://web-production-fa83.up.railway.app
```

## URL Structure

The frontend supports the following URL patterns:

- `/` - Landing page
- `/{company}/chat/{token}` - Welcome page (redirects from backend links)
- `/{company}/chat/{token}/session` - Chat interface
- `/thank-you` - Session completion page
- `/error` - Error handling page

## API Integration

The frontend communicates with the Railway-hosted backend through these endpoints:

- `POST /api/validate-token` - Validates access tokens
- `POST /api/chat` - Sends chat messages
- `POST /api/end-session` - Ends chat sessions

## Features

- **Anonymous Access** - Token-based authentication
- **Real-time Chat** - AI-powered wellness counseling
- **Session Management** - Start, maintain, and end sessions
- **Error Handling** - Graceful error states and recovery
- **Mobile Responsive** - Optimized for all device sizes

## Development

For local development:

```bash
# Serve static files (use any static file server)
npx serve .

# Or use Python
python -m http.server 8080

# Or use Node.js
npx http-server
```

## Files Structure

```
vercel-frontend/
├── index.html          # Landing page
├── chat.html           # Chat interface
├── welcome.html        # Session welcome
├── thank-you.html      # Completion page
├── error.html          # Error handling
├── vercel.json         # Vercel configuration
├── static/
│   ├── style.css       # Styles
│   ├── chat.js         # Chat functionality
│   └── router.js       # Client-side routing
└── README.md           # This file
```

## Security

- No sensitive data stored in frontend
- Token-based access only
- HTTPS-only communication with backend
- XSS protection through content sanitization
