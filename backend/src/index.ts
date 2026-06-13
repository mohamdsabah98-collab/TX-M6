import 'dotenv/config';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';

// Import routes
import authRoutes from './routes/auth.routes.js';
import fileRoutes from './routes/file.routes.js';
import userRoutes from './routes/user.routes.js';
import shareRoutes from './routes/share.routes.js';
import adminRoutes from './routes/admin.routes.js';
import downloadRoutes from './routes/download.routes.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';
import { validateEnv } from './utils/validateEnv.js';

const app: Express = express();
const port = process.env.PORT || 5000;

// Initialize Prisma
export const prisma = new PrismaClient();

// ========== SECURITY MIDDLEWARE ==========
app.use(helmet());
app.use(
  cors({
    origin: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ========== RATE LIMITING ==========
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per 15 minutes
  skipSuccessfulRequests: true,
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 uploads per hour
  skipSuccessfulRequests: true,
});

app.use('/api/', limiter);

// ========== BODY PARSER MIDDLEWARE ==========
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ========== LOGGING MIDDLEWARE ==========
app.use(requestLogger);

// ========== HEALTH CHECK ==========
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// ========== API ROUTES ==========
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/files', uploadLimiter, fileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/download', downloadRoutes);
app.use('/api/admin', adminRoutes);

// ========== 404 HANDLER ==========
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
  });
});

// ========== ERROR HANDLER ==========
app.use(errorHandler);

// ========== SERVER STARTUP ==========
const startServer = async () => {
  try {
    // Validate environment variables
    validateEnv();

    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Start server
    app.listen(port, () => {
      console.log(`
${'='.repeat(60)}`);
      console.log(`🚀 TX-M6 Backend Server`);
      console.log(`${"=".repeat(60)}`);
      console.log(`🌐 Server running at: http://localhost:${port}`);
      console.log(`🔧 Environment: ${process.env.NODE_ENV}`);
      console.log(`📊 API Docs: http://localhost:${port}/api-docs`);
      console.log(`${'='.repeat(60)}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// ========== GRACEFUL SHUTDOWN ==========
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Terminating...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
