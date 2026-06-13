# TX-M6 Backend

Modern, scalable backend API for TX-M6 file hosting platform.

## Features

- ✅ User authentication (Email/OAuth Google)
- ✅ File upload and management
- ✅ File sharing with security
- ✅ Admin dashboard and controls
- ✅ Download tracking and analytics
- ✅ Storage management
- ✅ Rate limiting and CORS

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT + OAuth Google
- **File Storage**: Cloudflare R2 / AWS S3

## Quick Start

### Prerequisites

```bash
node --version  # v20.0.0+
npm --version   # v10.0.0+
postgres --version  # v14.0.0+
```

### Installation

1. **Setup environment**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup database**
   ```bash
   npm run migrate
   npm run prisma:generate
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Server runs at `http://localhost:5000`

## Environment Variables

```env
# Server
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/tx_m6

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

# Storage (Cloudflare R2)
CLOUDFLARE_R2_BUCKET=tx-m6-files
CLOUDFLARE_R2_ENDPOINT=https://account-id.r2.cloudflarestorage.com

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_FILE_SIZE=5368709120
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google` - Google OAuth
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh token

### Files
- `POST /api/files/upload` - Upload file
- `GET /api/files` - List files
- `GET /api/files/:fileId` - Get file details
- `PATCH /api/files/:fileId/rename` - Rename file
- `DELETE /api/files/:fileId` - Delete file

### Sharing
- `POST /api/share/:fileId/generate` - Generate share link
- `GET /api/share/:shareId/info` - Get share info
- `DELETE /api/share/:shareId` - Delete share link

### User
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/storage` - Get storage info
- `GET /api/users/stats` - Get user statistics

### Admin
- `GET /api/admin/users` - List all users
- `GET /api/admin/stats/overview` - Get overview stats
- `GET /api/admin/analytics/downloads` - Download analytics
- `PATCH /api/admin/users/:userId/suspend` - Suspend user

## Database Schema

### Main Models
- **User**: User account and profile
- **File**: File metadata and storage info
- **Folder**: Folder structure
- **Share**: Sharing configuration
- **Download**: Download tracking
- **Analytics**: Analytics and statistics

## Development

### Run Tests
```bash
npm run test
```

### Linting
```bash
npm run lint
```

### Format Code
```bash
npm run format
```

### Database

**Create migration**
```bash
npm run migrate:dev -- --name migration_name
```

**View database**
```bash
npx prisma studio
```

## Docker

```bash
docker build -t tx-m6-backend .
docker run -p 5000:5000 --env-file .env tx-m6-backend
```

## Security

- ✅ HTTPS ready
- ✅ CSRF protection
- ✅ Rate limiting
- ✅ Input validation
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Secure headers (Helmet)

## Performance

- Database indexing on frequently queried fields
- Rate limiting to prevent abuse
- Efficient pagination
- Caching strategies

## Deployment

### Heroku
```bash
git push heroku main
```

### Railway
```bash
railway link
railway deploy
```

### Docker Compose
```bash
docker-compose up -d
```

## License

MIT
