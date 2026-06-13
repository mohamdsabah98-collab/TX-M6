# TX-M6 Installation & Setup Guide

## 🎯 System Requirements

### Minimum Requirements
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 50GB
- **OS**: Linux, macOS, or Windows (WSL2)

### Recommended Requirements
- **CPU**: 4+ cores
- **RAM**: 8GB+
- **Storage**: 100GB+
- **OS**: Ubuntu 20.04 LTS or later

## 📋 Prerequisites

### Install Node.js & npm

**Ubuntu/Debian:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**macOS (Homebrew):**
```bash
brew install node@20
```

**Windows:**
- Download from https://nodejs.org/en/ (LTS version)
- Or use Chocolatey: `choco install nodejs`

### Verify Installation
```bash
node --version  # Should be v20.0.0 or higher
npm --version   # Should be v10.0.0 or higher
```

### Install Docker & Docker Compose

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install -y docker.io docker-compose
sudo usermod -aG docker $USER
```

**macOS:**
```bash
brew install docker docker-compose
```

**Windows:**
- Download Docker Desktop from https://www.docker.com/products/docker-desktop
- Or use WSL2 backend

### Verify Docker Installation
```bash
docker --version
docker-compose --version
```

## 🔧 Installation Steps

### 1. Clone Repository

```bash
git clone https://github.com/mohamdsabah98-collab/TX-M6.git
cd TX-M6
```

### 2. Setup Environment Variables

#### Root .env
```bash
cp .env.example .env
```

Edit `.env` and set:
```env
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:5000
```

#### Backend .env
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
# Database
DATABASE_URL="postgresql://tx_m6_user:tx_m6_password@localhost:5432/tx_m6"

# JWT
JWT_SECRET="your-super-secret-key-min-32-characters-long"
JWT_EXPIRE="7d"

# Storage (Cloudflare R2)
CLOUDFLARE_R2_BUCKET="tx-m6-files"
CLOUDFLARE_R2_ENDPOINT="https://your-account-id.r2.cloudflarestorage.com"
CLOUDFLARE_R2_ACCESS_KEY_ID="your-access-key"
CLOUDFLARE_R2_SECRET_ACCESS_KEY="your-secret-key"

# Or AWS S3
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="tx-m6-files"

# Google OAuth
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:5000/api/auth/google/callback"
```

#### Frontend .env.local
```bash
cp frontend/.env.example frontend/.env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Install Dependencies

**Option A: Using npm (Manual Setup)**

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

**Option B: Using Docker Compose (Recommended)**

```bash
# Build Docker images
docker-compose build
```

## ▶️ Running the Application

### Option 1: Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### Option 2: Manual Setup

**Terminal 1 - Backend:**
```bash
cd backend
npm run migrate
npm run dev
```

Expected output:
```
✅ Database connected successfully
🚀 TX-M6 Backend Server
🌐 Server running at: http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Expected output:
```
▲ Next.js 14.0.4
- Local: http://localhost:3000
```

**Terminal 3 - Database (if not using Docker):**
```bash
# Start PostgreSQL
sudo service postgresql start

# Or with Docker
docker run --name tx-m6-postgres -e POSTGRES_PASSWORD=tx_m6_password -p 5432:5432 -d postgres:16
```

## ✅ Verify Installation

### 1. Check Backend
```bash
curl http://localhost:5000/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2024-01-10T12:00:00.000Z",
  "uptime": 42.5,
  "environment": "development"
}
```

### 2. Check Frontend
```bash
curl http://localhost:3000

# Should return HTML page
```

### 3. Test Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

## 🐛 Troubleshooting

### Port Already in Use

**Error:** `listen EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>

# Or change port in .env
PORT=5001
```

### Database Connection Failed

**Error:** `connect ECONNREFUSED 127.0.0.1:5432`

**Solution:**
```bash
# Check if PostgreSQL is running
psql -U tx_m6_user -d tx_m6 -h localhost

# Start PostgreSQL
sudo service postgresql start

# Or check Docker container
docker ps | grep postgres
```

### Environment Variables Not Loading

**Solution:**
```bash
# Clear node cache
rm -rf node_modules/.cache

# Reinstall dependencies
npm install

# Restart application
```

### CORS Issues

**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution:**
1. Check `CORS_ORIGIN` in backend `.env`
2. Ensure it matches your frontend URL
3. Restart backend server

```env
CORS_ORIGIN="http://localhost:3000"
```

## 🚀 Next Steps

1. **Create Admin Account**
   - Register at http://localhost:3000
   - Set as admin in database

2. **Configure Services**
   - Setup Cloudflare R2 bucket
   - Or configure AWS S3
   - Setup Google OAuth

3. **Test Features**
   - Upload files
   - Create shares
   - Download files
   - Test admin panel

4. **Read Documentation**
   - [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
   - [backend/README.md](./backend/README.md) - Backend docs
   - [frontend/README.md](./frontend/README.md) - Frontend docs

## 📚 Useful Commands

### Database
```bash
# Run migrations
cd backend
npm run migrate

# Generate Prisma client
npm run prisma:generate

# Open Prisma Studio
npm run prisma:studio

# Create new migration
npm run migrate:dev -- --name migration_name
```

### Development
```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check

# Run tests
npm run test
```

### Docker
```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Execute command in container
docker-compose exec backend npm run migrate

# Rebuild containers
docker-compose down
docker-compose build
docker-compose up -d
```

## 💡 Tips

1. **Use Docker for consistent environment**
2. **Keep `.env` files private** - never commit them
3. **Use strong JWT secrets** in production
4. **Enable HTTPS** on all domains
5. **Set up automated backups** for database
6. **Monitor logs** for errors
7. **Test file uploads** before going live
8. **Configure rate limiting** appropriately

## 🆘 Getting Help

- Check logs: `docker-compose logs -f`
- Read error messages carefully
- Search GitHub issues: https://github.com/mohamdsabah98-collab/TX-M6/issues
- Ask in Discord: https://discord.gg/tx-m6
- Email support: support@tx-m6.com

---

**Congratulations! TX-M6 is now running! 🎉**
