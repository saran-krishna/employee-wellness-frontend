# Employee Wellness Chat - Frontend

Anonymous employee wellness chat interface deployed on Vercel.

## 🌐 Live URL Structure
```
https://your-domain.vercel.app/{company-name}/chat/{token}
```

## 🏗️ Architecture
- **Frontend**: Static HTML/CSS/JS on Vercel
- **Backend**: FastAPI on Railway (`https://web-production-fa83.up.railway.app`)
- **Admin**: Streamlit Cloud (token generation & analytics)

## 📁 Project Structure
```
frontend-repo/
├── index.html          # Main chat interface
├── static/
│   ├── style.css       # Styling
│   └── chat.js         # Chat functionality
├── vercel.json         # Vercel routing config
└── README.md           # This file
```

## 🚀 Deployment
This repository is automatically deployed to Vercel via GitHub integration.

### Manual Deployment
```bash
npm install -g vercel
vercel --prod
```

## 🔗 URL Routing
- `/{company}/chat/{token}` → Chat interface with pre-configured access
- All other routes → Redirect to chat interface

## 🛠️ Development
1. Clone repository
2. Open `index.html` in browser
3. Test with URL: `localhost:3000/testcompany/chat/testtoken`

## 🔧 Configuration
- Backend API: `https://web-production-fa83.up.railway.app`
- CORS: Configured for Vercel domains
- Routes: Dynamic company/token extraction

## 🔐 Security
- No sensitive data in frontend
- Token-based authentication
- Anonymous user sessions
- HTTPS-only communication

## 📊 Analytics
All analytics are handled by the Railway backend and viewed through the Streamlit admin dashboard.

---

**Admin Dashboard**: Streamlit Cloud (separate deployment)  
**Backend API**: Railway (separate deployment)  
**Frontend**: This Vercel deployment
