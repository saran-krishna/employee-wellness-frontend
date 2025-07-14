# Employee Wellness Chat - Frontend

A secure, anonymous employee wellness chat interface deployed on Vercel, integrated with Railway backend and Streamlit admin dashboard.

## 🌐 Live Application

- **Frontend**: https://employee-wellness-frontend-i8su.vercel.app
- **Backend API**: https://web-production-fa83.up.railway.app  
- **Admin Dashboard**: https://employee-wellness-admin.streamlit.app

## 🎯 How It Works

### For Employees:
1. **Receive Access Link** from your admin (e.g., `https://employee-wellness-frontend-i8su.vercel.app/techcorp/chat/emp_abc123`)
2. **Click the Link** - No registration required
3. **Start Chatting** with the AI wellness counselor
4. **Complete Session** anonymously

### For Admins:
1. **Access Admin Dashboard** at Streamlit
2. **Generate Employee Tokens** with email, name, and team
3. **Share Chat URLs** with employees
4. **View Analytics** - team-level insights only

## 🔒 Privacy & Security

- ✅ **100% Anonymous** - No personal conversations stored
- ✅ **Token-Based Access** - Secure, time-limited links
- ✅ **Team-Level Analytics** - No individual tracking
- ✅ **GDPR Compliant** - Privacy by design

## 🚀 Technology Stack

- **Frontend**: Static HTML/CSS/JavaScript (Vercel)
- **Backend**: FastAPI + Python (Railway)
- **Admin**: Streamlit (Streamlit Cloud)
- **Database**: Google Firestore
- **AI**: OpenAI GPT-3.5-turbo

## 📱 URL Structure

The application supports these URL patterns:

- `/` - Landing page with information
- `/{company}/chat/{token}` - Welcome page (entry point)
- `/{company}/chat/{token}/session` - Chat interface
- `/thank-you` - Session completion page
- `/error` - Error handling page

## 🔧 API Integration

The frontend communicates with the Railway backend through these endpoints:

- `POST /api/validate-token` - Validates access tokens
- `POST /api/chat` - Sends chat messages and receives AI responses
- `POST /api/end-session` - Ends chat sessions properly

## 🏢 Multi-Company Support

The system supports multiple companies with isolated data:

- **TechCorp** - Technology company
- **GlobalTech** - Global technology firm
- **gb_test** - Test company for development

Each company has separate token management and analytics.

## 🔄 Integration Flow

```
1. Admin (Streamlit) → Generate Token → Railway API
2. Railway → Returns chat URL with token
3. Employee → Clicks URL → Vercel Frontend
4. Vercel → Validates token → Railway API
5. Employee → Chats → Railway processes → Analytics
6. Admin → Views analytics → Streamlit Dashboard
```

## 📊 Features

### For Employees:
- Anonymous access via secure tokens
- AI-powered wellness counseling
- Mobile-responsive chat interface
- Session timer and progress tracking
- Graceful error handling

### For Admins:
- Token generation (single & bulk)
- Real-time analytics dashboard
- Team-level insights
- Stress level monitoring
- Retention risk assessment
- CSV export capabilities

## 🛠️ Development

This is a static site that requires no build process. The JavaScript automatically detects the environment and connects to the appropriate backend.

### Local Development:
```bash
# Serve locally
python -m http.server 3000

# Or use any static server
npx serve .
```

### Environment Detection:
- **Local**: Connects to `http://localhost:8000`
- **Production**: Connects to `https://web-production-fa83.up.railway.app`

## 📞 Support

For technical issues or questions about the employee wellness system, please contact your system administrator.

---

**Built with ❤️ for employee mental health and workplace wellness**

*Last Updated: July 15, 2025*
