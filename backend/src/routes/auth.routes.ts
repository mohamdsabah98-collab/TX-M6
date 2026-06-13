import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../index.js';
import { AppError } from '../middleware/errorHandler.js';
import { authMiddleware } from '../middleware/auth.js';
import { validateEmail, validatePassword } from '../utils/validators.js';
import { logger } from '../utils/logger.js';

const router = Router();

// ========== REGISTER ==========
router.post('/register', async (req: Request, res: Response, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      throw new AppError(400, 'Missing required fields: email, password, firstName, lastName');
    }

    if (!validateEmail(email)) {
      throw new AppError(400, 'Invalid email format');
    }

    if (!validatePassword(password)) {
      throw new AppError(400, 'Password must be at least 8 characters with uppercase, lowercase, and numbers');
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      throw new AppError(409, 'Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS || '10'));

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        role: 'USER',
        storageUsed: 0,
        subscriptionTier: 'FREE',
      },
    });

    // Generate tokens
    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    });

    logger.info('User registered successfully', { userId: user.id, email: user.email });

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
});

// ========== LOGIN ==========
router.post('/login', async (req: Request, res: Response, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError(400, 'Email and password required');
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !user.password) {
      throw new AppError(401, 'Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid email or password');
    }

    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    });

    logger.info('User logged in', { userId: user.id });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
});

// ========== GOOGLE LOGIN ==========
router.post('/google', async (req: Request, res: Response, next) => {
  try {
    const { googleId, email, firstName, lastName, profilePicture } = req.body;

    if (!googleId || !email) {
      throw new AppError(400, 'Missing required fields');
    }

    let user = await prisma.user.findFirst({
      where: {
        OR: [{ googleId }, { email: email.toLowerCase() }],
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          googleId,
          firstName: firstName || 'User',
          lastName: lastName || '',
          profilePicture,
          role: 'USER',
          storageUsed: 0,
          subscriptionTier: 'FREE',
        },
      });
    }

    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    });

    logger.info('User logged in via Google', { userId: user.id });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
});

// ========== PASSWORD RESET REQUEST ==========
router.post('/password-reset-request', async (req: Request, res: Response, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AppError(400, 'Email is required');
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // For security, don't reveal if user exists
    if (!user) {
      return res.json({ message: 'If email exists, password reset link will be sent' });
    }

    // Generate reset token
    const resetToken = jwt.sign({ userId: user.id, type: 'password-reset' }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1h',
    });

    // TODO: Send email with reset link
    logger.info('Password reset requested', { userId: user.id });

    res.json({ message: 'If email exists, password reset link will be sent' });
  } catch (error) {
    next(error);
  }
});

// ========== REFRESH TOKEN ==========
router.post('/refresh', authMiddleware, async (req: Request, res: Response, next) => {
  try {
    const newAccessToken = jwt.sign({ userId: req.userId }, process.env.JWT_SECRET || 'secret', {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
});

// ========== LOGOUT ==========
router.post('/logout', authMiddleware, async (req: Request, res: Response, next) => {
  try {
    // Token invalidation would be handled by client or Redis blacklist
    logger.info('User logged out', { userId: req.userId });
    res.json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
});

export default router;
