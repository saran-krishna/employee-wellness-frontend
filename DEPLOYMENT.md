# 🚀 Deployment Guide - Employee Wellness Frontend

## Step-by-Step Deployment to Vercel

### 1. **Push to Your Public GitHub Repository**

```bash
# Navigate to the deployment directory
cd "d:\PRESENT\newBase_HOST\public-frontend-deploy"

# Initialize git
git init

# Add your public repository as origin
git remote add origin https://github.com/saran-krishna/employee-wellness-frontend.git

# Add all files
git add .

# Commit
git commit -m "Deploy: Complete frontend with Railway integration

✅ All HTML pages (index, welcome, chat, thank-you, error)
✅ Static assets (CSS, JS) with Railway API integration  
✅ Vercel routing configuration optimized
✅ Multi-company support
✅ Anonymous token-based authentication
✅ Mobile-responsive design

Backend: https://web-production-fa83.up.railway.app
Admin: https://employee-wellness-admin.streamlit.app"

# Push to GitHub (may require authentication)
git push --force origin main
```

### 2. **Deploy to Vercel**

1. **Go to Vercel**: https://vercel.com/dashboard
2. **Import Project**: Click "Add New..." → "Project"
3. **Select Repository**: Choose `employee-wellness-frontend`
4. **Configure Deployment**:
   - **Framework Preset**: "Other" (static site)
   - **Root Directory**: `.` (default)
   - **Build Command**: Leave empty
   - **Output Directory**: `.` (default)
   - **Install Command**: Leave empty

5. **Deploy**: Click "Deploy"

### 3. **Expected Result**

- **URL**: `https://employee-wellness-frontend-i8su.vercel.app` (or similar)
- **Status**: Deployed and accessible
- **Integration**: Connected to Railway backend

### 4. **Test the Deployment**

#### Test 1: Landing Page
Visit: `https://employee-wellness-frontend-i8su.vercel.app/`
- Should show the employee wellness landing page
- CSS and styling should load properly

#### Test 2: Generate Token from Admin
1. Go to your Streamlit admin dashboard
2. Generate a token for a test employee
3. You should get a URL like:
   `https://employee-wellness-frontend-i8su.vercel.app/techcorp/chat/emp_abc123`

#### Test 3: Complete Chat Flow
1. Click the generated URL
2. Should redirect to welcome page
3. Click "Start Chat" 
4. Should load chat interface
5. Type a message and verify AI responds
6. End session should redirect to thank you page

### 5. **Verify Integration Points**

✅ **Frontend → Railway**: Chat messages flow to backend
✅ **Railway → Frontend**: AI responses display properly  
✅ **Admin → Railway**: Token generation works
✅ **Railway → Admin**: Analytics flow back to dashboard

### 6. **Domain Configuration**

Your deployment will be accessible at:
- **Auto-generated**: `https://employee-wellness-frontend-xyz.vercel.app`
- **Custom Domain**: (Optional) Configure in Vercel settings

### 7. **Backend CORS Verification**

Your Railway backend config already includes:
```python
CORS_ORIGINS = [
    "https://employee-wellness-frontend-i8su.vercel.app",
    "https://*.vercel.app",  # Wildcard for Vercel domains
    # ... other origins
]
```

If you get a different Vercel URL, update the backend config.

## 🔧 Troubleshooting

### Common Issues:

1. **"DEPLOYMENT_NOT_FOUND"**:
   - Repository not properly connected
   - Try importing project again in Vercel

2. **404 on token URLs**:
   - Check `vercel.json` routing rules
   - Verify file structure is correct

3. **API Connection Errors**:
   - Check browser console for CORS errors
   - Verify Railway backend is running
   - Check Railway URL in chat.js

4. **Token Validation Fails**:
   - Test with fresh token from admin dashboard
   - Check token format and expiry

### Debug Steps:

1. **Check Vercel Deployment Logs**: Go to Vercel dashboard → Project → Functions tab
2. **Check Browser Console**: F12 → Console tab for JavaScript errors
3. **Test Railway API**: Visit `https://web-production-fa83.up.railway.app/health`
4. **Verify Token**: Use admin dashboard to generate fresh test token

## 🎉 Success Criteria

Your deployment is successful when:

- ✅ Landing page loads at your Vercel URL
- ✅ Admin can generate tokens from Streamlit
- ✅ Generated URLs point to your Vercel domain
- ✅ Token validation works (welcome page loads)
- ✅ Chat interface connects to Railway backend
- ✅ AI responses appear in chat
- ✅ Session completion redirects to thank you page
- ✅ Analytics appear in admin dashboard

---

**Ready to deploy? Follow the steps above!** 🚀
