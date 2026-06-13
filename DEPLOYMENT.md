# Deployment Guide for TX-M6

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+
- PostgreSQL 14+
- Git

### Local Development

```bash
# Clone repository
git clone https://github.com/mohamdsabah98-collab/TX-M6.git
cd TX-M6

# Setup environment
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Edit configuration files with your credentials

# Start with Docker Compose
docker-compose -f docker-compose.dev.yml up -d

# Or manually start
# Terminal 1: Backend
cd backend
npm install
npm run migrate
npm run dev

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Database: localhost:5432

## 🐳 Docker Deployment

### Production Deployment

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Docker Compose Services

1. **PostgreSQL** - Database (Port 5432)
2. **Redis** - Caching (Port 6379)
3. **Backend** - API Server (Port 5000)
4. **Frontend** - Web Application (Port 3000)

## ☁️ Cloudflare Pages Deployment (Frontend)

### Setup

1. **Create Cloudflare Account**
   - Go to https://pages.cloudflare.com
   - Connect GitHub repository

2. **Configure Build Settings**
   ```
   Framework: Next.js
   Build command: npm run build
   Build output directory: .next
   Environment variables:
   NEXT_PUBLIC_API_URL=https://api.tx-m6.com
   ```

3. **Deploy**
   - Connect repository
   - Cloudflare automatically deploys on push

## 🚀 Railway Deployment (Backend)

### Setup

1. **Install Railway CLI**
   ```bash
   npm install -g railway
   ```

2. **Login and Initialize**
   ```bash
   railway login
   railway init
   ```

3. **Add Services**
   ```bash
   railway add postgres
   railway add redis
   ```

4. **Configure Environment**
   ```bash
   railway variables add DATABASE_URL=postgresql://...
   railway variables add JWT_SECRET=your-secret
   # Add other environment variables
   ```

5. **Deploy**
   ```bash
   railway up
   ```

## 🎯 Heroku Deployment (Backend)

### Setup

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login and Create App**
   ```bash
   heroku login
   heroku create tx-m6-api
   ```

3. **Add PostgreSQL Addon**
   ```bash
   heroku addons:create heroku-postgresql:standard-0 --app tx-m6-api
   ```

4. **Configure Environment**
   ```bash
   heroku config:set JWT_SECRET=your-secret --app tx-m6-api
   heroku config:set CLOUDFLARE_R2_BUCKET=tx-m6-files --app tx-m6-api
   # Set other variables
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

## 🔐 Security Setup

### SSL/TLS
- Enable HTTPS on all domains
- Use Cloudflare SSL/TLS for automatic certificates
- Update API_URL to use https://

### Environment Variables (Production)

```bash
# Keep these secure and never commit
NODE_ENV=production
JWT_SECRET=<strong-random-key>
DATABASE_URL=postgresql://...
CLOUDFLARE_R2_BUCKET=tx-m6-files
CLOUDFLARE_R2_ENDPOINT=https://<account>.r2.cloudflarestorage.com
CLOUDFLARE_R2_ACCESS_KEY_ID=<key>
CLOUDFLARE_R2_SECRET_ACCESS_KEY=<secret>
GOOGLE_CLIENT_ID=<google-oauth-id>
GOOGLE_CLIENT_SECRET=<google-oauth-secret>
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

### Database Backups

```bash
# Backup PostgreSQL
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

## 📊 Monitoring & Logging

### Application Monitoring

- **Sentry** (Error tracking)
  ```bash
  npm install @sentry/node
  ```

- **NewRelic** (APM)
  ```bash
  npm install newrelic
  ```

### Log Aggregation

- **LogRocket** (Session replay)
- **Datadog** (Infrastructure monitoring)
- **ELK Stack** (Self-hosted)

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: npm run deploy
```

## 🌍 Domain Setup

### DNS Configuration

1. **Cloudflare Pages (Frontend)**
   - Add CNAME: `www.tx-m6.com -> pages.cloudflare.com`
   - Add alias: `tx-m6.com -> www.tx-m6.com`

2. **Backend API**
   - Add CNAME: `api.tx-m6.com -> railway.app`
   - Or use custom domain in Railway

## 📱 Mobile App Deployment

### React Native / Expo

```bash
# Build APK
eas build --platform android --app-variant release

# Build IPA
eas build --platform ios --app-variant release

# Submit to stores
eas submit
```

## 🧪 Testing Before Production

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# Load testing
Apache JMeter or k6

# Security scanning
npm audit
npm run security-check
```

## 📞 Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check connection string
psql $DATABASE_URL

# Verify credentials
```

**Environment Variables Not Loading**
```bash
# Check .env file exists
ls -la .env

# Reload application
```

**File Upload Issues**
```bash
# Check Cloudflare R2 credentials
# Verify bucket exists
# Check CORS settings
```

## 📚 Additional Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Express.js Production Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [PostgreSQL Backups](https://www.postgresql.org/docs/current/backup.html)
