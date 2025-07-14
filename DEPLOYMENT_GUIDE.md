# Vercel Deployment Guide - Employee Wellness Chat Frontend

## Prerequisites

1. **GitHub Account** - For hosting the repository
2. **Vercel Account** - For deployment (free tier available)
3. **Railway Backend** - Already deployed and running

## Step 1: Create New GitHub Repository

1. **Create a new public repository** on GitHub
   - Name: `employee-wellness-frontend` (or your preferred name)
   - Visibility: **Public** (required for Vercel free tier)
   - Initialize with README: No (we'll push existing code)

## Step 2: Push Code to GitHub

```bash
# Navigate to vercel-frontend directory
cd "d:\PRESENT\newBase_HOST\vercel-frontend"

# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit: Employee Wellness Chat Frontend"

# Add GitHub remote (replace with your repository URL)
git remote add origin https://github.com/YOUR_USERNAME/employee-wellness-frontend.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### Option A: Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard** - https://vercel.com/dashboard
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure project**:
   - Framework Preset: **Other**
   - Root Directory: `./` (default)
   - Build Command: Leave empty (static site)
   - Output Directory: Leave empty
5. **Add Environment Variables**:
   - Key: `VITE_API_BASE_URL`
   - Value: `https://web-production-fa83.up.railway.app`
6. **Click "Deploy"**

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from vercel-frontend directory
cd "d:\PRESENT\newBase_HOST\vercel-frontend"
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: employee-wellness-frontend
# - Directory: ./
# - Override settings? No

# Set environment variable
vercel env add VITE_API_BASE_URL production
# Enter value: https://web-production-fa83.up.railway.app
```

## Step 4: Configure Domain (Optional)

1. **In Vercel Dashboard** → Your Project → Settings → Domains
2. **Add custom domain** or use provided `.vercel.app` domain
3. **Update DNS** if using custom domain

## Step 5: Test Deployment

### Test URLs to verify:

1. **Landing Page**: `https://your-app.vercel.app/`
2. **Chat Access**: `https://your-app.vercel.app/demo/chat/test_token`
3. **Direct Chat**: `https://your-app.vercel.app/demo/chat/test_token/session`
4. **Thank You**: `https://your-app.vercel.app/thank-you`
5. **Error Page**: `https://your-app.vercel.app/error`

### Test API Integration:

1. **Open browser console** on chat page
2. **Check for errors** in Network tab
3. **Verify API calls** are reaching Railway backend
4. **Test token validation** and chat functionality

## Step 6: Update Backend CORS (If Needed)

If you encounter CORS errors, update your Railway backend CORS settings:

```python
# In backend/main.py, update CORS origins:
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-app.vercel.app",  # Add your Vercel domain
        "https://web-production-fa83.up.railway.app",
        "*"  # Remove this in production for security
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Step 7: Production Configuration

### Environment Variables in Vercel:

- `VITE_API_BASE_URL`: Your Railway backend URL

### Security Headers (Optional):

Add to `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

## Troubleshooting

### Common Issues:

1. **404 Errors on Direct URL Access**
   - Check `vercel.json` routes configuration
   - Ensure all routes redirect to correct HTML files

2. **API Connection Failures**
   - Verify `VITE_API_BASE_URL` environment variable
   - Check Railway backend CORS settings
   - Verify Railway backend is running

3. **Token Validation Errors**
   - Ensure token format matches backend expectations
   - Check backend logs for validation errors

4. **Build/Deploy Failures**
   - Verify all files are committed to Git
   - Check Vercel build logs for errors
   - Ensure no missing dependencies

### Debug Steps:

1. **Check Vercel Function Logs**
2. **Use browser developer tools** Network tab
3. **Verify environment variables** in Vercel dashboard
4. **Test API endpoints** directly with curl/Postman

## Success Indicators

✅ **Frontend deployed successfully**
✅ **API calls reaching Railway backend**
✅ **Token validation working**
✅ **Chat interface functional**
✅ **All routes working correctly**
✅ **Mobile responsive design**

## Next Steps

1. **Test with real tokens** from admin dashboard
2. **Monitor performance** and error rates
3. **Set up custom domain** if needed
4. **Configure analytics** (optional)
5. **Set up alerts** for downtime monitoring
