const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Usage Analytics
const analytics = {
  totalUsers: 0,
  uniqueUsers: new Set(),
  websitesGenerated: 0,
  providerUsage: {
    openai: 0,
    deepseek: 0,
    template: 0
  },
  popularRequests: {},
  startTime: new Date(),
  lastActivity: new Date()
};

// Track unique users
const trackUser = (req) => {
  const userIP = req.ip || req.connection.remoteAddress || 'unknown';
  const userAgent = req.get('User-Agent') || 'unknown';
  const userKey = `${userIP}-${userAgent}`;
  
  analytics.uniqueUsers.add(userKey);
  analytics.totalUsers++;
  analytics.lastActivity = new Date();
  
  return userKey;
};

// LLM API integrations
const { OpenAI } = require('openai');

let openai;
let deepseek;
let currentProvider = 'openai'; // default provider

// Initialize OpenAI
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Initialize DeepSeek (using OpenAI-compatible client)
if (process.env.DEEPSEEK_API_KEY) {
  deepseek = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com/v1',
  });
}

// Enhanced LLM-powered website generation with provider selection
const generateWebsiteWithLLM = async (description, provider = 'openai') => {
  let client;
  let model;
  
  if (provider === 'deepseek' && deepseek) {
    client = deepseek;
    model = "deepseek-chat";
    console.log('Using DeepSeek for website generation...');
  } else if (openai) {
    client = openai;
    model = "gpt-3.5-turbo";
    console.log('Using OpenAI GPT-3.5-turbo for website generation...');
  } else {
    throw new Error('No LLM provider configured');
  }

  const prompt = `You are an expert web developer. Create a complete, modern, responsive HTML website based on this description: "${description}"

Requirements:
- Include complete HTML, CSS, and JavaScript in a single file
- Make it responsive and mobile-friendly
- Use modern CSS with gradients, shadows, and animations
- Include interactive elements if appropriate
- Make it visually appealing and professional
- Use semantic HTML5 elements
- Include proper meta tags and viewport settings
- Keep the code clean and well-structured
- Optimize for token usage efficiency

Return ONLY the complete HTML file with embedded CSS and JavaScript. No explanations, just the code.`;

  try {
    const completion = await client.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: "You are an expert web developer who creates beautiful, modern websites. Always return complete, working HTML files. Keep responses concise but complete."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error(`${provider} API error:`, error);
    throw new Error(`${provider} generation failed: ${error.message}`);
  }
};

// Fallback template-based generator (for testing without API keys)
const generateWebsiteWithTemplates = async (description) => {
  const templates = {
    'hello world': `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello World</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            text-align: center;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
        }
        h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        p {
            font-size: 1.2rem;
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Hello World!</h1>
        <p>Welcome to your generated website</p>
    </div>
</body>
</html>`,
    
    'portfolio': `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Portfolio</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background: #f5f5f5;
        }
        .header {
            background: #2c3e50;
            color: white;
            text-align: center;
            padding: 3rem 0;
        }
        .content {
            max-width: 800px;
            margin: 2rem auto;
            padding: 0 1rem;
        }
        .project {
            background: white;
            margin: 1rem 0;
            padding: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-top: 1rem;
        }
        .skill {
            background: #3498db;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>My Portfolio</h1>
        <p>Web Developer & Designer</p>
    </div>
    <div class="content">
        <div class="project">
            <h2>Project 1</h2>
            <p>A responsive web application built with modern technologies.</p>
            <div class="skills">
                <span class="skill">HTML</span>
                <span class="skill">CSS</span>
                <span class="skill">JavaScript</span>
            </div>
        </div>
        <div class="project">
            <h2>Project 2</h2>
            <p>Mobile-first design with beautiful animations.</p>
            <div class="skills">
                <span class="skill">React</span>
                <span class="skill">Tailwind</span>
                <span class="skill">Node.js</span>
            </div>
        </div>
    </div>
</body>
</html>`,

    'landing page': `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Amazing Landing Page</title>
    <style>
        body {
            margin: 0;
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
        }
        .hero {
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            color: white;
            text-align: center;
            padding: 4rem 2rem;
        }
        .hero h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        .cta-button {
            display: inline-block;
            background: white;
            color: #ff6b6b;
            padding: 1rem 2rem;
            text-decoration: none;
            border-radius: 50px;
            font-weight: bold;
            margin-top: 1rem;
            transition: transform 0.3s;
        }
        .cta-button:hover {
            transform: translateY(-3px);
        }
        .features {
            padding: 3rem 2rem;
            text-align: center;
        }
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            max-width: 1000px;
            margin: 0 auto;
        }
        .feature {
            padding: 1.5rem;
            background: #f8f9fa;
            border-radius: 10px;
        }
    </style>
</head>
<body>
    <div class="hero">
        <h1>Welcome to Our Platform</h1>
        <p>The best solution for all your needs</p>
        <a href="#" class="cta-button">Get Started</a>
    </div>
    <div class="features">
        <h2>Why Choose Us?</h2>
        <div class="feature-grid">
            <div class="feature">
                <h3>Fast & Reliable</h3>
                <p>Lightning-fast performance you can count on.</p>
            </div>
            <div class="feature">
                <h3>Easy to Use</h3>
                <p>Intuitive interface designed for everyone.</p>
            </div>
            <div class="feature">
                <h3>24/7 Support</h3>
                <p>We're here to help whenever you need us.</p>
            </div>
        </div>
    </div>
</body>
</html>`
  };

  // Simple keyword matching (replace with actual LLM API call)
  const lowerDesc = description.toLowerCase();
  let template = templates['hello world']; // default
  
  if (lowerDesc.includes('portfolio') || lowerDesc.includes('resume')) {
    template = templates['portfolio'];
  } else if (lowerDesc.includes('landing') || lowerDesc.includes('marketing')) {
    template = templates['landing page'];
  } else if (lowerDesc.includes('hello') || lowerDesc.includes('world')) {
    template = templates['hello world'];
  }

  return template;
};

// Main website generation function with provider selection
const generateWebsite = async (description, provider = 'auto') => {
  try {
    // Auto-select provider based on availability
    if (provider === 'auto') {
      if (deepseek) {
        provider = 'deepseek';
      } else if (openai) {
        provider = 'openai';
      } else {
        throw new Error('No LLM providers configured');
      }
    }

    // Try LLM first if available
    if ((provider === 'deepseek' && deepseek) || (provider === 'openai' && openai)) {
      return await generateWebsiteWithLLM(description, provider);
    } else {
      console.log('LLM not configured, using template fallback...');
      return await generateWebsiteWithTemplates(description);
    }
  } catch (error) {
    console.error('LLM generation failed, falling back to templates:', error);
    return await generateWebsiteWithTemplates(description);
  }
};

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Track all requests
app.use((req, res, next) => {
  trackUser(req);
  next();
});

// IDE Routes
app.post('/api/generate', async (req, res) => {
  try {
    const { description, provider = 'auto' } = req.body;
    
    if (!description) {
      return res.status(400).json({
        success: false,
        message: 'Description is required'
      });
    }

    // Track popular requests
    const key = description.toLowerCase().substring(0, 50);
    analytics.popularRequests[key] = (analytics.popularRequests[key] || 0) + 1;

    console.log(`Generating website for: "${description}" with provider: ${provider}`);
    const html = await generateWebsite(description, provider);
    
    // Track website generation
    analytics.websitesGenerated++;
    
    // Determine which provider was actually used
    let actualProvider = 'template';
    if (provider === 'deepseek' && deepseek) actualProvider = 'DeepSeek';
    else if (provider === 'openai' && openai) actualProvider = 'OpenAI GPT-3.5-turbo';
    else if (provider === 'auto') {
      if (deepseek) actualProvider = 'DeepSeek (auto-selected)';
      else if (openai) actualProvider = 'OpenAI GPT-3.5-turbo (auto-selected)';
    }
    
    // Track provider usage
    if (actualProvider.includes('DeepSeek')) analytics.providerUsage.deepseek++;
    else if (actualProvider.includes('OpenAI')) analytics.providerUsage.openai++;
    else analytics.providerUsage.template++;
    
    res.json({
      success: true,
      html: html,
      message: 'Website generated successfully',
      method: actualProvider,
      provider: provider
    });
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate website',
      error: error.message
    });
  }
});

// Provider selection endpoint
app.post('/api/set-provider', (req, res) => {
  try {
    const { provider } = req.body;
    
    if (provider === 'deepseek' && !deepseek) {
      return res.status(400).json({
        success: false,
        message: 'DeepSeek not configured. Add DEEPSEEK_API_KEY to .env'
      });
    }
    
    if (provider === 'openai' && !openai) {
      return res.status(400).json({
        success: false,
        message: 'OpenAI not configured. Add OPENAI_API_KEY to .env'
      });
    }
    
    currentProvider = provider;
    
    res.json({
      success: true,
      message: `Provider switched to ${provider}`,
      provider: currentProvider
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to switch provider',
      error: error.message
    });
  }
});

// Analytics endpoint
app.get('/api/analytics', (req, res) => {
  res.json({
    success: true,
    data: {
      totalUsers: analytics.totalUsers,
      uniqueUsers: analytics.uniqueUsers.size,
      websitesGenerated: analytics.websitesGenerated,
      providerUsage: analytics.providerUsage,
      popularRequests: Object.entries(analytics.popularRequests)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([request, count]) => ({ request, count })),
      uptime: {
        startTime: analytics.startTime,
        lastActivity: analytics.lastActivity,
        duration: Date.now() - analytics.startTime.getTime()
      }
    }
  });
});

// Health check with provider status and analytics
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Cloud IDE Server is running',
    providers: {
      openai: !!openai,
      deepseek: !!deepseek,
      current: currentProvider
    },
    analytics: {
      totalUsers: analytics.totalUsers,
      uniqueUsers: analytics.uniqueUsers.size,
      websitesGenerated: analytics.websitesGenerated
    },
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Cloud IDE Server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Analytics: http://localhost:${PORT}/api/analytics`);
  console.log(`🌐 API base: http://localhost:${PORT}/api`);
  
  if (openai && deepseek) {
    console.log(`🤖 LLM Integration: Multiple providers available`);
    console.log(`   - OpenAI GPT-3.5-turbo: Enabled`);
    console.log(`   - DeepSeek: Enabled`);
    console.log(`   - Current provider: ${currentProvider}`);
  } else if (openai) {
    console.log(`🤖 LLM Integration: OpenAI GPT-3.5-turbo enabled (Free Tier Optimized)`);
    console.log(`💰 Cost: ~$0.002 per website generation`);
  } else if (deepseek) {
    console.log(`🤖 LLM Integration: DeepSeek enabled`);
    console.log(`💰 Cost: Free tier available, check DeepSeek pricing`);
  } else {
    console.log(`⚠️  LLM Integration: No providers configured, using template fallback`);
    console.log(`💡 Add OPENAI_API_KEY or DEEPSEEK_API_KEY to .env to enable AI generation`);
  }
  
  console.log(`📈 Analytics tracking enabled - monitor usage at /api/analytics`);
});

module.exports = app;
