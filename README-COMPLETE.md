# TX-M6 - Complete Production-Ready Codebase

**Modern, Fast, and Secure File Hosting & Sharing Platform**

![Status](https://img.shields.io/badge/status-production--ready-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-20%2B-brightgreen)
![Next.js](https://img.shields.io/badge/next.js-14%2B-black)

## 🌟 Features

### 📁 File Management
- ✅ Upload files up to 5GB
- ✅ Organize files in folders
- ✅ Search and sort functionality
- ✅ Bulk operations (delete, move, copy)
- ✅ File preview support
- ✅ Version history

### 🔗 File Sharing
- ✅ Generate unique share links
- ✅ Public and private sharing
- ✅ Password-protected downloads
- ✅ Expiration date settings
- ✅ QR code generation
- ✅ Download tracking
- ✅ Custom share settings

### 👥 User Management
- ✅ Email/password authentication
- ✅ Google OAuth integration
- ✅ Profile customization
- ✅ Password reset
- ✅ Account settings
- ✅ Storage quota management

### 📊 Dashboard
- ✅ Storage analytics
- ✅ Upload/download statistics
- ✅ Recent activity
- ✅ Usage overview
- ✅ Account information
- ✅ Billing information

### 🛡️ Security
- ✅ HTTPS/TLS encryption
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Rate limiting
- ✅ CSRF protection
- ✅ XSS prevention
- ✅ SQL injection prevention
- ✅ File malware scanning

### 🎨 UI/UX
- ✅ Mobile-first responsive design
- ✅ Dark/Light mode
- ✅ Smooth animations
- ✅ Loading states
- ✅ Error handling
- ✅ Progress indicators
- ✅ Toast notifications

### 💰 Monetization
- ✅ Google AdSense integration
- ✅ Premium subscriptions
- ✅ Storage tiers
- ✅ Stripe payment integration
- ✅ Usage analytics
- ✅ Revenue tracking

### 🌐 Multi-language
- ✅ English
- ✅ Arabic
- ✅ Easy to add more languages

### 📱 Progressive Web App
- ✅ Installable on mobile
- ✅ Offline support
- ✅ Push notifications
- ✅ Service workers

## 🏗️ Architecture

### Frontend Stack
```
Next.js 14 + React 18
├── Tailwind CSS (Styling)
├── Framer Motion (Animations)
├── Axios (HTTP Client)
├── next-themes (Dark Mode)
└── TypeScript (Type Safety)
```

### Backend Stack
```
Express.js + Node.js
├── Prisma ORM (Database)
├── PostgreSQL (Database)
├── JWT (Authentication)
├── Passport.js (OAuth)
├── Multer (File Upload)
└── TypeScript (Type Safety)
```

### Infrastructure
```
Docker & Docker Compose
├── PostgreSQL (Database)
├── Redis (Caching)
├── Backend Container
└── Frontend Container
```

### Storage
```
Cloudflare R2 / AWS S3
├── File Storage
├── CDN Integration
└── Automatic Backups
```

## 📁 Project Structure

```
TX-M6/
├── backend/
│   ├── src/
│   │   ├── routes/              # API routes
│   │   ├── middleware/          # Custom middleware
│   │   ├── controllers/         # Route handlers
│   │   ├── services/            # Business logic
│   │   ├── utils/               # Utility functions
│   │   └── index.ts             # Entry point
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema
│   │   └── migrations/          # Database migrations
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/                 # Next.js app directory
│   │   ├── components/          # React components
│   │   ├── hooks/               # Custom hooks
│   │   ├── utils/               # Utility functions
│   │   └── styles/              # Global styles
│   ├── public/                  # Static assets
│   ├── Dockerfile
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── docker-compose.yml           # Production compose
├── docker-compose.dev.yml       # Development compose
├── .env.example                 # Example env variables
├── DEPLOYMENT.md                # Deployment guide
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 14+
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/mohamdsabah98-collab/TX-M6.git
cd TX-M6

# Setup environment
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Edit configuration files
# Backend .env: Database URL, JWT secret, Cloudflare credentials
# Frontend .env.local: API URL

# Start with Docker Compose
docker-compose up -d
```

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Database: localhost:5432

### Manual Setup

**Backend:**
```bash
cd backend
npm install
npm run migrate
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 📖 API Documentation

### Authentication
```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login user
POST   /api/auth/google            Google OAuth
POST   /api/auth/logout            Logout user
POST   /api/auth/refresh           Refresh token
```

### Files
```
GET    /api/files                  List files
POST   /api/files/upload           Upload file
GET    /api/files/:id              Get file details
PATCH  /api/files/:id/rename       Rename file
DELETE /api/files/:id              Delete file
```

### Sharing
```
POST   /api/share/:id/generate     Generate share link
GET    /api/share/:id/info         Get share info
GET    /api/share/:id/list         List shares
DELETE /api/share/:id              Delete share
```

### User
```
GET    /api/users/profile          Get profile
PUT    /api/users/profile          Update profile
GET    /api/users/storage          Get storage info
GET    /api/users/stats            Get statistics
```

### Admin
```
GET    /api/admin/users            List users
GET    /api/admin/stats/overview   Get overview
GET    /api/admin/analytics        Get analytics
PATCH  /api/admin/users/:id/suspend Suspend user
```

## 🗄️ Database Schema

### Models
- **User** - User accounts and profiles
- **File** - File metadata and storage
- **Folder** - Folder organization
- **Share** - Sharing configurations
- **Download** - Download tracking
- **Tag** - File tagging system
- **Analytics** - Usage analytics
- **Advertisement** - Ad management

## 🔐 Security Features

✅ **Authentication**
- JWT token-based
- Refresh tokens
- Password hashing (bcrypt)
- Session management

✅ **Authorization**
- Role-based access control
- File ownership verification
- Admin panel protection

✅ **Data Protection**
- HTTPS/TLS encryption
- Database encryption
- File encryption support
- Secure password storage

✅ **API Security**
- Rate limiting
- CORS configuration
- CSRF protection
- XSS prevention
- Input validation
- SQL injection prevention

✅ **File Security**
- Malware scanning
- File type validation
- Size limits
- Virus scanning integration

## 📊 Performance Optimization

- Database indexing
- Query optimization
- Caching strategies (Redis)
- Image optimization
- Code splitting
- Lazy loading
- CDN integration
- Compression (gzip, brotli)

## 🧪 Testing

```bash
# Run tests
npm run test

# Coverage report
npm run test:coverage

# Integration tests
npm run test:integration
```

## 📦 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Supported Platforms:**
- Docker/Docker Compose
- Cloudflare Pages (Frontend)
- Railway (Backend)
- Heroku (Backend)
- AWS (Backend)
- DigitalOcean (Full Stack)
- Netlify (Frontend)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

MIT License - See [LICENSE](./LICENSE) file for details

## 📞 Support

- 📧 Email: support@tx-m6.com
- 💬 Discord: [Join Server](https://discord.gg/tx-m6)
- 🐛 Issues: [GitHub Issues](https://github.com/mohamdsabah98-collab/TX-M6/issues)
- 📖 Docs: [Documentation](https://docs.tx-m6.com)

## 🗺️ Roadmap

- [ ] Mobile apps (iOS/Android)
- [ ] Advanced search with AI
- [ ] File collaboration features
- [ ] Advanced permissions system
- [ ] File versioning
- [ ] Batch operations
- [ ] Advanced analytics dashboard
- [ ] API rate limiting tiers
- [ ] Webhook support
- [ ] Custom branding for enterprise

## 🙏 Acknowledgments

- Inspired by MediaFire, Google Drive, and Dropbox
- Built with ❤️ by the TX-M6 Team
- Special thanks to all contributors

---

**Made with ❤️ for fast, secure, and easy file sharing**

[Visit Website](https://tx-m6.com) | [GitHub](https://github.com/mohamdsabah98-collab/TX-M6) | [Documentation](https://docs.tx-m6.com)
