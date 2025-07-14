# 🚀 GITHUB DEPLOYMENT INSTRUCTIONS

## 📋 Frontend Repository Created Successfully!

### 📁 Repository Structure:
```
frontend-repo/
├── index.html          ✅ Token-based chat interface
├── static/
│   ├── style.css       ✅ Complete styling
│   └── chat.js         ✅ URL routing + Railway API
├── vercel.json         ✅ Dynamic routing config
├── README.md           ✅ Repository documentation
├── .gitignore          ✅ Git ignore rules
└── DEPLOYMENT.md       ✅ This file
```

## 🔗 URL Structure Ready:
**Format**: `https://yoursite.com/{company-name}/chat/{token}`

**Examples**:
- `https://yoursite.com/techcorp/chat/emp_abc123`
- `https://yoursite.com/globaltech/chat/emp_xyz789`

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Create New GitHub Repository
1. Go to https://github.com/new
2. Repository name: `employee-wellness-frontend` (or your choice)
3. Description: `Anonymous employee wellness chat interface`
4. Set as **Public** (for Vercel free tier)
5. **DON'T** initialize with README (we have one)
6. Click **Create repository**

### Step 2: Push Frontend Code to GitHub
```bash
# Navigate to frontend folder
cd d:\PRESENT\newBase_HOST\frontend-repo

# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial frontend repository for employee wellness chat"

# Add GitHub remote (replace with your repo URL)
git remote add origin https://github.com/YOUR-USERNAME/employee-wellness-frontend.git

# Push to GitHub
git push -u origin main
```

### Step 3: Connect to Vercel
1. Go to https://vercel.com/dashboard
2. Click **New Project**
3. Select **Import Git Repository**
4. Choose your new GitHub repo
5. **Framework Preset**: Other
6. **Root Directory**: `.` (default)
7. **Build Command**: Leave empty
8. **Output Directory**: Leave empty
9. Click **Deploy**

### Step 4: Configure Custom Domain (Optional)
1. In Vercel project settings
2. Go to **Domains** tab
3. Add your custom domain
4. Follow DNS configuration instructions

### Step 5: Update Railway CORS
Add your Vercel domain to Railway backend CORS settings:
```python
# In Railway backend code
origins = [
    "https://your-vercel-domain.vercel.app",
    "https://your-custom-domain.com"  # if using custom domain
]
```

---

## ✅ VERIFICATION CHECKLIST

After deployment, test these URLs:

### Valid Token URLs:
- `https://yoursite.com/testcompany/chat/testtoken123`
- `https://yoursite.com/techcorp/chat/emp_demo456`

### Expected Behavior:
- [ ] Chat interface loads
- [ ] Company name extracted from URL
- [ ] Token passed to Railway backend
- [ ] Chat messages work
- [ ] Session timer functions
- [ ] End session works

### Invalid URLs:
- `https://yoursite.com/` → Should show chat interface
- `https://yoursite.com/invalid` → Should show error or redirect

---

## 🔧 TROUBLESHOOTING

### Common Issues:

1. **404 Errors**
   - Check `vercel.json` routing configuration
   - Ensure all files are in repository root

2. **CORS Errors**
   - Add Vercel domain to Railway CORS settings
   - Check browser console for specific errors

3. **API Connection Issues**
   - Verify Railway backend is running
   - Check `chat.js` API_BASE_URL configuration

4. **Token Extraction Errors**
   - Test URL format: `/{company}/chat/{token}`
   - Check browser console for JavaScript errors

---

## 🎉 SUCCESS!

Once deployed, your employees can access the chat using URLs like:
`https://your-wellness-site.com/techcorp/chat/emp_unique_token_123`

The admin dashboard (Streamlit Cloud) will generate these personalized links with valid tokens.

**Ready to create the GitHub repository?** Follow Step 1 above! 🚀
