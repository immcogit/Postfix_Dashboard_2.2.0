# 📧 Postfix Mail Relay Dashboard v2.1.0

A modern, production-ready full-stack web application for monitoring and managing Postfix mail server logs with AI-powered analytics.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![React](https://img.shields.io/badge/react-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/typescript-5.2.2-blue)
![Version](https://img.shields.io/badge/version-2.1.0-success)

## 📋 Table of Contents

- [Overview](#overview)
- [What's New in v2.1](#whats-new-in-v21)
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

The Postfix Mail Relay Dashboard is a comprehensive monitoring solution that provides real-time insights into your Postfix mail server operations. Built with modern web technologies, it features an intuitive interface, advanced log analysis, AI-powered anomaly detection, and comprehensive mail flow statistics.

### Key Highlights

- **Real-time Monitoring**: Track mail delivery, bounces, and deferrals in real-time
- **AI-Powered Analysis**: Leverage Gemini or Ollama AI to detect anomalies, threats, and errors
- **Interactive Dashboard**: Visualize mail volume trends with interactive charts
- **Network Management**: Add, remove, and manage allowed relay networks directly from the UI
- **Advanced Filtering**: Filter logs by date range, status, and search criteria
- **Export Capabilities**: Export log data to CSV for external analysis
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Production Ready**: Proper Tailwind CSS build, favicon, collapsible sidebar

## ✨ What's New in v2.1.0

### 🎉 Major Improvements

1. **✅ Production-Ready Tailwind CSS**
   - Removed CDN dependency
   - Proper PostCSS integration
   - Optimized build size
   - Custom theme configuration

2. **✅ Enhanced Date Filtering**
   - Fixed "Today" filter (now correctly shows only today's logs)
   - Added "This Week" and "This Month" filters
   - Accurate date range calculations
   - Better timezone handling

3. **✅ Collapsible Sidebar**
   - Space-saving collapsed mode
   - Smooth animations
   - Keyboard accessible
   - Persists user preference

4. **✅ Favicon Support**
   - Custom SVG favicon
   - Multiple sizes (16x16, 32x32)
   - Proper meta tags

5. **✅ Enhanced Configuration**
   - All AI settings in .env files
   - Configurable model names
   - Better security practices
   - Environment-specific configs

6. **✅ Improved Error Handling**
   - Better error boundaries
   - User-friendly error messages
   - Logging improvements
   - Request timeout handling

7. **✅ Performance Optimizations**
   - Reduced bundle size
   - Better caching strategies
   - Optimized re-renders
   - Lazy loading support

## ✨ Features

### Dashboard
- 📊 **Real-time Statistics**: Total mails, delivered, bounced, and deferred counts
- 📈 **Volume Trends Chart**: Visualize mail flow patterns over time
- 🔔 **Recent Critical Activity**: Monitor security events and system alerts
- 🎯 **Quick Filters**: Today, This Week, Last 7/30 Days, This Month
- 🖱️ **Interactive Stats Cards**: Click on any stat card to drill down into specific logs

### Mail Logs
- 📝 **Detailed Log Table**: View all mail transactions with timestamps, sender, recipient, status
- 🔍 **Advanced Filtering**: Filter by date range, delivery status (sent/bounced/deferred/rejected)
- 📄 **Pagination**: Efficient browsing with configurable page sizes (25, 50, 100, 200)
- 💾 **Export to CSV**: Download filtered logs for external analysis
- 🔎 **Log Details Modal**: Click any log entry to view full details

### AI Log Analysis
- 🤖 **AI-Powered Insights**: Get intelligent analysis using Gemini API or local Ollama
- 📊 **Comprehensive Reports**: 
  - Executive summary with actionable insights
  - Key statistics (success rate, bounce rate, etc.)
  - Anomaly detection with specific examples
  - Security threat identification
  - Configuration error analysis
  - Actionable recommendations
- 🎚️ **Configurable Analysis**: Choose number of logs to analyze (25-200)
- ✍️ **Manual Analysis**: Paste specific log snippets for targeted analysis

### Network Management
- 🌐 **Visual Network List**: See all allowed relay networks at a glance
- ➕ **Add Networks**: Add new IPs, CIDR ranges, or hostnames with validation
- 🗑️ **Remove Networks**: Easily remove networks with one click
- 📋 **Copy Functionality**: Copy individual networks or all networks at once
- ✅ **Input Validation**: Automatic validation of IP addresses, CIDR notation, and hostnames
- ⚠️ **Safety Warnings**: Clear warnings about security implications

### Security Features
- 🔐 **JWT Authentication**: Secure token-based authentication
- ⏱️ **Session Management**: Configurable token expiry (default 24 hours)
- 🛡️ **Protected Routes**: All API endpoints require authentication
- 🔒 **Environment Variables**: Sensitive data stored in .env files

## 🏗️ Architecture

```
postfix-dashboard/
├── backend/                 # Node.js/Express backend
│   ├── server.js           # Main server file (enhanced)
│   ├── package.json        # Backend dependencies
│   ├── .env               # Backend configuration
│   └── .env.example       # Example configuration
│
├── frontend/               # React/TypeScript frontend
│   ├── public/            # Static assets
│   │   ├── favicon.svg   # NEW: Custom favicon
│   │   ├── favicon-16x16.png
│   │   └── favicon-32x32.png
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Dashboard.tsx (Enhanced)
│   │   │   ├── Sidebar.tsx (NEW: Collapsible)
│   │   │   ├── MailLogTable.tsx
│   │   │   ├── AILogAnalysis.tsx
│   │   │   ├── AllowedNetworks.tsx
│   │   │   └── ...
│   │   ├── services/      # API service layer
│   │   │   ├── apiService.ts
│   │   │   └── authService.ts
│   │   ├── context/       # React context
│   │   │   └── AuthContext.tsx
│   │   ├── utils/         # NEW: Utility functions
│   │   │   └── dateUtils.ts
│   │   ├── types.ts       # TypeScript types
│   │   ├── config/        # Configuration
│   │   ├── index.css      # NEW: Tailwind CSS
│   │   └── index.tsx
│   ├── tailwind.config.js # NEW: Tailwind config
│   ├── postcss.config.js  # NEW: PostCSS config
│   ├── package.json       # Frontend dependencies
│   ├── .env              # Frontend configuration
│   └── .env.example      # Example configuration
│
└── README.md             # This file
```

### Technology Stack

**Backend:**
- Node.js 18+
- Express.js 4.19
- Google Generative AI (Gemini 2.0)
- CORS, dotenv
- Enhanced logging

**Frontend:**
- React 18.2
- TypeScript 5.2
- Vite 5.0
- Recharts 2.12
- Tailwind CSS 3.4 (PostCSS)

## 🔧 Prerequisites

Before installation, ensure you have:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** 9.x or higher (comes with Node.js)
- **Postfix** mail server installed and running
- **Access to Postfix logs** (typically `/var/log/mail.log`)
- **(Optional)** Gemini API key for AI analysis ([Get API Key](https://makersuite.google.com/app/apikey))
- **(Optional)** Ollama installed for local AI analysis ([Install Ollama](https://ollama.ai/))

### System Requirements

- **OS**: Linux (Ubuntu 20.04+, Debian 11+, CentOS 8+, RHEL 8+)
- **RAM**: Minimum 2GB, Recommended 4GB
- **Disk**: 500MB free space
- **Network**: Internet connection (for Gemini AI) or local network (for Ollama)

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/immcogit/Postfix_Dashboard_2.0.git
cd Postfix_Dashboard_2.0
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
nano .env
```

Configure your `.env` file:

```bash
# Server Configuration
PORT=3001

# Authentication
DASHBOARD_USER=admin@example.com
DASHBOARD_PASSWORD=YourSecurePassword123!
TOKEN_SECRET=your-random-secret-key-here-min-32-chars
TOKEN_EXPIRY_HOURS=24

# Postfix Configuration
POSTFIX_LOG_PATH=/var/log/mail.log
POSTFIX_CONFIG_PATH=/etc/postfix/main.cf

# AI Provider: 'gemini' or 'ollama'
AI_PROVIDER=ollama

# Gemini Configuration
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_MODEL=gemini-2.0-flash-exp

# Ollama Configuration
OLLAMA_API_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:latest

# AI Analysis Settings
AI_ANALYSIS_MAX_LOGS=200
AI_ANALYSIS_DEFAULT_LOGS=50
AI_ANALYSIS_TIMEOUT=60000

# Logging
LOG_LEVEL=info
ENABLE_REQUEST_LOGGING=true
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```bash
cp .env.example .env
nano .env
```

Configure your `.env` file:

```bash
# API Configuration (leave empty for development)
VITE_API_BASE_URL=

# API timeout
VITE_API_TIMEOUT=30000

# Authentication
VITE_TOKEN_EXPIRY_HOURS=24

# Application
VITE_APP_NAME=Postfix Dashboard
VITE_APP_VERSION=2.1.0
```

### 4. File Permissions

Ensure the backend has permission to read Postfix logs:

```bash
# Option 1: Add user to postfix group (recommended)
sudo usermod -a -G postfix $USER
sudo chmod 640 /var/log/mail.log
sudo chown root:postfix /var/log/mail.log

# Log out and back in for group changes to take effect

# Option 2: For testing, use a copy
sudo cp /var/log/mail.log /tmp/mail.log
sudo chmod 644 /tmp/mail.log
# Then set POSTFIX_LOG_PATH=/tmp/mail.log in backend/.env
```

For network management, grant write access to `main.cf`:

```bash
# Production (recommended)
sudo chmod 664 /etc/postfix/main.cf
sudo chown root:postfix /etc/postfix/main.cf
sudo usermod -a -G postfix $USER

# Testing
sudo cp /etc/postfix/main.cf /tmp/main.cf
sudo chmod 666 /tmp/main.cf
# Then set POSTFIX_CONFIG_PATH=/tmp/main.cf in backend/.env
```

### 5. Generate Favicon (Optional)

If you want to customize the favicon, replace the files in `frontend/public/`:

```bash
# Generate PNG favicons from SVG
# You can use online tools or ImageMagick
convert public/favicon.svg -resize 16x16 public/favicon-16x16.png
convert public/favicon.svg -resize 32x32 public/favicon-32x32.png
```

## 🚀 Development

### Start Backend Server

```bash
cd backend
npm start
```

The backend will start on `http://localhost:3001`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

Login with the credentials you set in `backend/.env`:
- Email: `admin@example.com`
- Password: `YourSecurePassword123!`

## ⚙️ Configuration

### Backend Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Backend server port | `3001` | No |
| `DASHBOARD_USER` | Login email | - | Yes |
| `DASHBOARD_PASSWORD` | Login password | - | Yes |
| `TOKEN_SECRET` | JWT secret key | Random | No |
| `TOKEN_EXPIRY_HOURS` | Token validity | `24` | No |
| `POSTFIX_LOG_PATH` | Path to mail.log | `/var/log/mail.log` | Yes |
| `POSTFIX_CONFIG_PATH` | Path to main.cf | `/etc/postfix/main.cf` | Yes |
| `AI_PROVIDER` | AI provider | `ollama` | No |
| `GEMINI_API_KEY` | Gemini API key | - | If using Gemini |
| `GEMINI_MODEL` | Gemini model | `gemini-2.0-flash-exp` | No |
| `OLLAMA_API_BASE_URL` | Ollama server URL | `http://localhost:11434` | If using Ollama |
| `OLLAMA_MODEL` | Ollama model | `llama3.2:latest` | No |
| `AI_ANALYSIS_MAX_LOGS` | Max logs for AI | `200` | No |
| `AI_ANALYSIS_DEFAULT_LOGS` | Default logs for AI | `50` | No |
| `LOG_LEVEL` | Logging level | `info` | No |

### Frontend Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_BASE_URL` | Backend URL (empty for dev) | `` | No |
| `VITE_API_TIMEOUT` | Request timeout (ms) | `30000` | No |
| `VITE_TOKEN_EXPIRY_HOURS` | Token expiry | `24` | No |
| `VITE_APP_NAME` | Application name | `Postfix Dashboard` | No |
| `VITE_APP_VERSION` | App version | `2.1.0` | No |

## 🌐 Deployment

### Production Build

#### 1. Build Frontend

```bash
cd frontend
npm run build
```

This creates optimized files in `frontend/dist/`

#### 2. Configure Production Environment

Update `frontend/.env`:
```bash
VITE_API_BASE_URL=http://your-server-ip:3001
```

Update `backend/.env` with production credentials.

#### 3. Serve with Nginx

```nginx
# /etc/nginx/sites-available/postfix-dashboard

server {
    listen 80;
    server_name your-domain.com;
    
    root /path/to/frontend/dist;
    index index.html;
    
    # Frontend
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/postfix-dashboard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 4. Use PM2 for Process Management

```bash
# Install PM2
npm install -g pm2

# Start backend
cd backend
pm2 start server.js --name postfix-backend

# Start frontend (if not using Nginx)
cd ../frontend
pm2 serve dist 3000 --name postfix-frontend --spa

# Save PM2 configuration
pm2 save
pm2 startup
```

#### 5. SSL/HTTPS Setup

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 📚 API Documentation

See the full API documentation in the [API.md](API.md) file (TODO: Create comprehensive API documentation).

### Quick Reference

- `POST /api/login` - Authenticate user
- `GET /api/logs` - Retrieve mail logs
- `GET /api/stats` - Get mail statistics
- `GET /api/volume-trends` - Get volume trends
- `GET /api/recent-activity` - Get recent critical events
- `GET /api/allowed-networks` - Get allowed networks
- `POST /api/allowed-networks` - Update allowed networks
- `POST /api/analyze-logs` - AI log analysis
- `GET /api/health` - Health check

## 🔍 Troubleshooting

### Common Issues

#### Tailwind Styles Not Working

**Problem**: Styles not applied after upgrade

**Solution**:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### Backend Won't Start

**Problem**: `EACCES: permission denied, open '/var/log/mail.log'`

**Solution**:
```bash
sudo usermod -a -G postfix $USER
# Log out and back in
sudo chmod 640 /var/log/mail.log
```

#### Date Filter Shows Wrong Data

**Problem**: "Today" shows yesterday's logs

**Solution**: This is fixed in v2.1. Make sure you're using the updated dateUtils.ts

#### AI Analysis Fails

**Gemini**:
1. Verify `GEMINI_API_KEY` in `backend/.env`
2. Check API quota at [Google AI Studio](https://makersuite.google.com/)
3. Ensure internet connectivity

**Ollama**:
1. Check Ollama is running: `ollama list`
2. Verify `OLLAMA_API_BASE_URL` is correct
3. Ensure model is installed: `ollama pull llama3.2`

## 🗺️ Roadmap

### Completed ✅
- [x] Production-ready Tailwind CSS implementation
- [x] Fixed date filtering logic
- [x] Collapsible sidebar
- [x] Favicon support
- [x] Enhanced AI configuration
- [x] Improved error handling
- [x] Performance optimizations

### Upcoming 🚀
- [ ] Email notifications for critical events
- [ ] Multi-server support
- [ ] Advanced search with regex
- [ ] Custom dashboards
- [ ] Real-time log streaming (WebSocket)
- [ ] LDAP/Active Directory authentication
- [ ] Multi-language support (i18n)
- [ ] Dark/Light theme toggle
- [ ] Scheduled reports
- [ ] Mobile app (React Native)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure all tests pass
- Keep commits atomic and meaningful
- Use TypeScript strict mode

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Postfix](http://www.postfix.org/) - The mail transfer agent
- [React](https://reactjs.org/) - Frontend framework
- [Recharts](https://recharts.org/) - Charting library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Google Gemini](https://deepmind.google/technologies/gemini/) - AI analysis
- [Ollama](https://ollama.ai/) - Local AI models

## 📞 Support

For issues and questions:
- Open an issue on [GitHub Issues](https://github.com/immcogit/Postfix_Dashboard_2.0/issues)
- Check [Documentation](https://github.com/immcogit/Postfix_Dashboard_2.0/wiki)

---

**Made with ❤️ for the mail server community**

Version 2.1.0 - Updated October 2025
