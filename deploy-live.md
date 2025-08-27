# 🚀 Deploy Your Cloud IDE Live!

## 🌐 **Quick Deployment (Choose One):**

### **Option A: Vercel + Railway (Recommended - Free)**

#### **1. Frontend to Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel --prod
```

**Result**: You'll get a URL like `https://your-ide.vercel.app`

#### **2. Backend to Railway:**
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project
4. Connect your GitHub repo
5. Set environment variables:
   ```
   NODE_ENV=production
   PORT=5000
   OPENAI_API_KEY=your_openai_key
   DEEPSEEK_API_KEY=your_deepseek_key
   ```

**Result**: You'll get a URL like `https://your-backend.railway.app`

#### **3. Update Frontend Config:**
After getting your backend URL, update `frontend/next.config.js`:
```javascript
destination: 'https://your-backend.railway.app/api/:path*'
```

### **Option B: Netlify + Render (Free)**

#### **1. Frontend to Netlify:**
```bash
cd frontend
npm run build
```
Then drag the `out` folder to [Netlify](https://netlify.com)

#### **2. Backend to Render:**
1. Go to [Render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repo
4. Set environment variables

## 🔑 **Environment Setup:**

### **Production .env (on hosting platform):**
```env
NODE_ENV=production
PORT=5000
OPENAI_API_KEY=your_openai_key
DEEPSEEK_API_KEY=your_deepseek_key
```

## 📱 **Test Your Live Deployment:**

1. **Frontend**: Your Vercel/Netlify URL
2. **Backend**: Your Railway/Render URL
3. **API Health**: `https://your-backend-url.com/api/health`

## 💰 **Cost Breakdown:**

- **Vercel**: Free tier (frontend)
- **Railway**: Free tier (backend)
- **Netlify**: Free tier (frontend)
- **Render**: Free tier (backend)
- **Total**: $0 for hosting! 🆓

## 🎯 **What You'll Get:**

- **Live URL** you can share with anyone
- **Professional Cloud IDE** accessible from anywhere
- **No local setup** required for users
- **Scalable hosting** that grows with your needs

## 🚀 **Ready to Deploy?**

**Choose your option and I'll guide you through each step!**

Your Cloud IDE will be live on the internet in minutes! 🌍✨
