# Employee Wellness Chat - Frontend

This is the frontend application for the Employee Wellness Chat system, deployed on Vercel.

## Live Application

- **Frontend**: https://employee-wellness-frontend-i8su.vercel.app
- **Backend API**: https://web-production-fa83.up.railway.app
- **Admin Dashboard**: https://employee-wellness-admin.streamlit.app

## Features

- **Anonymous Access** - Token-based authentication
- **Real-time Chat** - AI-powered wellness counseling
- **Multi-page Flow** - Welcome → Chat → Thank You
- **Error Handling** - Graceful error states and recovery
- **Responsive Design** - Works on desktop and mobile

## URL Structure

- `/` - Landing page
- `/{company}/chat/{token}` - Welcome page (entry point from admin)
- `/{company}/chat/{token}/session` - Chat interface
- `/thank-you` - Session completion page
- `/error` - Error handling page

## Technology Stack

- **Static HTML/CSS/JS** - No build process required
- **Client-side routing** - URL parsing and navigation
- **Environment-based API** - Connects to Railway backend
- **Vercel hosting** - Static site deployment

## Deployment

This repository is automatically deployed to Vercel when changes are pushed to the main branch.

## Integration Flow

1. **Admin** generates token in Streamlit dashboard
2. **Employee** receives URL: `/{company}/chat/{token}`
3. **Frontend** validates token with Railway backend
4. **Chat** flows through Railway API
5. **Analytics** aggregated for admin dashboard

---

**Last Updated**: July 15, 2025
