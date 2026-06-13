# TX-M6 - Professional File Hosting & Sharing Platform

![TX-M6 Logo](./docs/assets/logo.png)

TX-M6 is a modern, professional, mobile-first file hosting and sharing website inspired by MediaFire, Google Drive, and Dropbox.

## 🚀 Features

### User Features
- 📁 File Upload & Management (up to 5GB per file)
- 🔒 Secure Authentication (Email, OAuth Google)
- 📊 Dashboard with Storage Analytics
- 🔗 Share Files with Unique Links
- 🔐 Password-Protected Downloads
- ⏰ Download Expiration Dates
- 📱 Mobile-First Responsive Design
- 🌙 Dark/Light Mode
- 🌍 Multi-Language Support (English, Arabic)
- ⚡ Progressive Web App (PWA)

### Admin Features
- 👥 User Management
- 📋 File Moderation
- 📈 Analytics & Reports
- 💰 Monetization Management
- 🔐 Security Controls

## 🛠️ Technology Stack

### Frontend
- **React 18+** - UI Library
- **Next.js 14+** - React Framework
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **TypeScript** - Type Safety

### Backend
- **Node.js 20+** - Runtime
- **Express.js** - Web Framework
- **TypeScript** - Type Safety
- **PostgreSQL** - Database
- **Prisma** - ORM

### Storage & Deployment
- **Cloudflare R2** - File Storage
- **AWS S3** - Compatible Storage
- **JWT** - Authentication
- **Docker** - Containerization
- **Cloudflare Pages** - Frontend Deployment

## 📁 Project Structure

```
TX-M6/
├── frontend/              # React/Next.js Frontend
│   ├── app/              # App Router
│   ├── components/       # React Components
│   ├── pages/           # Pages
│   ├── styles/          # Global Styles
│   ├── hooks/           # Custom Hooks
│   ├── utils/           # Utilities
│   └── public/          # Static Assets
├── backend/              # Node.js/Express Backend
│   ├── src/
│   │   ├── routes/      # API Routes
│   │   ├── controllers/ # Route Handlers
│   │   ├── middleware/  # Custom Middleware
│   │   ├── services/    # Business Logic
│   │   ├── models/      # Database Models
│   │   └── utils/       # Utilities
│   └── prisma/          # Database Schema
├── docker-compose.yml    # Docker Configuration
├── .env.example         # Environment Variables
└── docs/                # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 14+
- Docker & Docker Compose (optional)
- Cloudflare R2 Account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mohamdsabah98-collab/TX-M6.git
   cd TX-M6
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your credentials
   npm run migrate
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.local.example .env.local
   # Edit .env.local with your API URL
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 🐳 Docker Deployment

```bash
docker-compose up -d
```

This will start:
- PostgreSQL Database
- Backend API (Port 5000)
- Frontend Application (Port 3000)

## 📚 API Documentation

API docs available at `http://localhost:5000/api-docs`

### Authentication Endpoints
- `POST /api/auth/register` - User Registration
- `POST /api/auth/login` - User Login
- `POST /api/auth/google` - Google OAuth
- `POST /api/auth/logout` - User Logout
- `POST /api/auth/refresh` - Refresh Token

### File Endpoints
- `GET /api/files` - List Files
- `POST /api/files/upload` - Upload File
- `GET /api/files/:id` - Get File Details
- `PUT /api/files/:id` - Update File
- `DELETE /api/files/:id` - Delete File
- `POST /api/files/:id/share` - Generate Share Link

### User Endpoints
- `GET /api/users/profile` - Get Profile
- `PUT /api/users/profile` - Update Profile
- `GET /api/users/storage` - Get Storage Info
- `POST /api/users/logout` - Logout

## 🔐 Security

- HTTPS/TLS Encryption
- JWT Token Authentication
- CSRF Protection
- XSS Prevention
- Rate Limiting
- Input Validation
- File Malware Scanning
- Secure Password Hashing (bcrypt)

## 📱 Features by Device

### Desktop
- Full Dashboard
- Advanced File Management
- Batch Operations
- Analytics Dashboard

### Mobile
- Simplified UI
- Touch-Optimized Controls
- Quick Upload
- File Preview
- Offline Support (PWA)

## 🌍 Supported Languages

- 🇺🇸 English
- 🇸🇦 العربية (Arabic)

## 💰 Monetization

- Google AdSense Integration
- Premium Subscription Plans
- Storage Tiers
- Rewarded Video Ads
- Banner Advertisements

## 📊 Admin Dashboard

- User Analytics
- File Statistics
- Storage Monitoring
- Revenue Tracking
- Moderation Panel
- Security Logs

## 🧪 Testing

```bash
# Backend Tests
cd backend
npm run test

# Frontend Tests
cd frontend
npm run test
```

## 📈 Performance

- Lazy Loading
- Code Splitting
- Image Optimization
- CDN Delivery
- Caching Strategies
- Database Indexing
- API Rate Limiting

## 🚀 Deployment

### Cloudflare Pages (Frontend)
```bash
npm run build
# Deploy to Cloudflare Pages
```

### Heroku / Railway (Backend)
```bash
git push heroku main
```

### Docker (Any Platform)
```bash
docker build -t tx-m6 .
docker run -p 3000:3000 -p 5000:5000 tx-m6
```

## 📝 Environment Variables

See `.env.example` for all required environment variables.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines.

## 📄 License

MIT License - See LICENSE file for details

## 🙋 Support

For support, email support@tx-m6.com or open an issue on GitHub.

## 🎯 Roadmap

- [ ] Mobile Apps (iOS/Android)
- [ ] AI-Powered File Organization
- [ ] Advanced Sharing Permissions
- [ ] File Versioning
- [ ] Collaborative Editing
- [ ] Advanced Analytics

---

**Made with ❤️ by TX-M6 Team**