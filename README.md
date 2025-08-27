# Cloud IDE - AI-Powered Web Development (Free Tier Optimized)

A super simple cloud IDE where users describe websites in chat and see them generated in real-time using AI/LLM technology. **Optimized for free tier usage!**

## 🚀 Features

- **AI-Powered Generation**: Connect to OpenAI GPT-3.5-turbo for intelligent website creation
- **Free Tier Friendly**: Optimized token usage for cost-effective development
- **Real-Time Preview**: Live preview of generated websites
- **Chat Interface**: Natural language descriptions for website requirements
- **Responsive Design**: Modern, mobile-friendly interface
- **Fallback System**: Template-based generation when LLM is unavailable

## 🏗️ Architecture

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: Node.js with Express.js
- **LLM Integration**: OpenAI GPT-3.5-turbo API (free tier optimized)
- **Real-Time**: Live website generation and preview

## 📁 Project Structure

```
Appclicks/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App router pages and components
│   ├── package.json         # Frontend dependencies
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   ├── tsconfig.json        # TypeScript configuration
│   └── next.config.js       # Next.js configuration
├── server.js                # Node.js backend with LLM integration
├── package.json             # Backend dependencies
└── README.md               # This file
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- OpenAI API key (optional but recommended)

### 1. Backend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure OpenAI API (Optional but Recommended):**
   
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=5000
   OPENAI_API_KEY=your_openai_api_key_here
   ```
   
   **Get your OpenAI API key:**
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Add it to your `.env` file
   
   **Note:** Without an API key, the system will use template fallbacks

3. **Start the backend server:**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

4. **Verify backend is running:**
   - Health check: http://localhost:5000/api/health
   - API base: http://localhost:5000/api

### 2. Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to http://localhost:3000

## 🤖 LLM Integration

### OpenAI GPT-3.5-turbo (Free Tier Optimized)

The system is configured to use OpenAI's GPT-3.5-turbo model for intelligent website generation:

- **Model**: GPT-3.5-turbo
- **Capabilities**: Full HTML/CSS/JS generation
- **Quality**: Professional, modern websites
- **Cost**: ~$0.002 per website generation (very affordable!)
- **Free Tier**: Perfect for development and testing

### Alternative LLM Providers

You can easily modify the code to use other LLM providers:

- **Anthropic Claude**
- **Google AI (Gemini)**
- **Local LLMs (Ollama, etc.)**

### Fallback System

If no LLM is configured, the system automatically falls back to:
- Smart template matching
- Pre-built website templates
- Keyword-based generation

## 🌐 API Endpoints

### Website Generation
- `POST /api/generate` - Generate website from description
  ```json
  {
    "description": "build me a portfolio website"
  }
  ```

### Health Check
- `GET /api/health` - Server status and LLM configuration

## 💡 Usage Examples

### Chat Commands

Try these examples in the chat interface:

1. **"build me a portfolio website"**
   - Generates a professional portfolio with projects and skills

2. **"create a landing page for a tech startup"**
   - Creates a modern landing page with hero section and features

3. **"make a simple hello world page"**
   - Generates a basic welcome page

4. **"build a restaurant website with menu"**
   - Creates a restaurant site with menu items and contact info

### Advanced Prompts

- **"Create a dark-themed portfolio with animations"**
- **"Build a responsive e-commerce homepage"**
- **"Make a blog template with sidebar navigation"**

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | No | `development` |
| `PORT` | Server port | No | `5000` |
| `OPENAI_API_KEY` | OpenAI API key | No | `undefined` |

### LLM Settings (Free Tier Optimized)

You can customize the LLM behavior in `server.js`:

```javascript
const completion = await openai.chat.completions.create({
  model: "gpt-3.5-turbo",    // Free tier friendly
  max_tokens: 2000,          // Optimized for cost
  temperature: 0.7,          // Control creativity (0.0-1.0)
});
```

## 💰 Cost Analysis

### Free Tier Usage

- **GPT-3.5-turbo**: ~$0.002 per website generation
- **Typical website**: 1000-2000 tokens
- **Monthly cost**: ~$0.50 for 250 websites
- **Free tier credits**: Usually sufficient for development

### Cost Comparison

| Model | Cost per Website | Quality | Best For |
|-------|------------------|---------|----------|
| GPT-3.5-turbo | $0.002 | High | Development, Testing |
| GPT-4 | $0.06 | Excellent | Production, Complex sites |
| Template Fallback | Free | Good | Basic sites, No API |

## 🚀 Deployment

### Backend Deployment

1. **Set environment variables:**
   ```env
   NODE_ENV=production
   PORT=5000
   OPENAI_API_KEY=your_production_key
   ```

2. **Use process manager:**
   ```bash
   npm install -g pm2
   pm2 start server.js --name "cloud-ide"
   ```

3. **Configure reverse proxy (nginx):**
   ```nginx
   location /api {
       proxy_pass http://localhost:5000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
   }
   ```

### Frontend Deployment

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Deploy to platforms:**
   - **Vercel**: `vercel --prod`
   - **Netlify**: `netlify deploy --prod`
   - **AWS S3**: Upload `out` folder

3. **Configure API proxy for production**

## 🛡️ Security Features

- **API Key Protection**: Environment variable storage
- **Input Validation**: Request sanitization
- **Rate Limiting**: Configurable API limits
- **CORS**: Cross-origin protection
- **Helmet**: Security headers

## 📱 Responsive Design

The IDE works perfectly on all devices:
- **Desktop**: Full two-panel layout
- **Tablet**: Responsive grid layout
- **Mobile**: Stacked panels for touch

## 🧪 Testing

### API Testing

Test the generation endpoint:

```bash
curl -X POST http://localhost:5000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"description": "build me a hello world page"}'
```

### Frontend Testing

- **Manual Testing**: Use the chat interface
- **Browser Testing**: Test on different devices
- **Performance**: Monitor generation speed

## 🔄 Future Enhancements

- **Multi-LLM Support**: Switch between providers
- **Website Templates**: Save and reuse designs
- **Collaboration**: Real-time editing with others
- **Version Control**: Track website changes
- **Export Options**: Download as ZIP, deploy to hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

### Common Issues

1. **"LLM generation failed"**
   - Check your OpenAI API key
   - Verify API quota and billing
   - Check network connectivity

2. **"Hydration error"**
   - Clear browser cache
   - Restart development servers
   - Check for timestamp mismatches

3. **"Generation timeout"**
   - Increase API timeout settings
   - Check server performance
   - Optimize prompt length

4. **"Free tier exceeded"**
   - Switch to GPT-3.5-turbo (already configured)
   - Monitor token usage
   - Use template fallback if needed

### Getting Help

- Check the documentation
- Review error logs
- Open an issue on GitHub
- Check OpenAI API status

---

**Happy Building! 🚀**

*Powered by OpenAI GPT-3.5-turbo and modern web technologies*
*Free tier optimized for cost-effective development*
