# 🚀 Quick Deployment Guide

## Option 1: Vercel (Recommended - Free & Fast)

### Frontend Deployment
1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy frontend:**
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Follow prompts and get your URL!**

### Backend Deployment
1. **Deploy to Railway (Free tier):**
   - Go to [Railway.app](https://railway.app)
   - Connect your GitHub repo
   - Set environment variables:
     ```
     NODE_ENV=production
     PORT=5000
     OPENAI_API_KEY=your_key_here
     ```

2. **Or deploy to Render (Free tier):**
   - Go to [Render.com](https://render.com)
   - Create new Web Service
   - Connect your repo
   - Set environment variables

## Option 2: Netlify + Heroku

### Frontend (Netlify)
1. **Build the project:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Netlify:**
   - Drag `out` folder to Netlify
   - Or connect GitHub repo

### Backend (Heroku)
1. **Create Heroku app:**
   ```bash
   heroku create your-cloud-ide
   ```

2. **Set environment variables:**
   ```bash
   heroku config:set OPENAI_API_KEY=your_key_here
   heroku config:set NODE_ENV=production
   ```

3. **Deploy:**
   ```bash
   git push heroku main
   ```

## Option 3: Local Development (For Testing)

1. **Start backend:**
   ```bash
   npm run dev
   ```

2. **Start frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Access at:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 🔑 Environment Setup

### Required for LLM
```env
OPENAI_API_KEY=sk-your-key-here
```

### Optional
```env
NODE_ENV=production
PORT=5000
```

## 🌐 Update Frontend API URL

After deploying backend, update `frontend/next.config.js`:

```javascript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'https://your-backend-url.com/api/:path*',
    },
  ];
},
```

## ✅ Quick Test

1. Deploy both services
2. Update API URL in frontend
3. Test with: "build me a hello world website"
4. Share your working URL!

## 💰 Cost Estimate

- **Vercel**: Free tier (frontend)
- **Railway**: Free tier (backend)
- **OpenAI**: ~$0.01-0.10 per website generation
- **Total**: Practically free for development!

---

**Your Cloud IDE will be live in minutes! 🎉**
