import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler.js';
import { prisma } from '../index.js';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: any;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new AppError(401, 'No authorization token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string };
    req.userId = decoded.userId;

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw new AppError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError(401, 'Invalid or expired token');
    }
    throw error;
  }
};

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authMiddleware(req, res, () => {});

    if (!req.user || req.user.role !== 'ADMIN') {
      throw new AppError(403, 'Access denied. Admin privileges required');
    }

    next();
  } catch (error) {
    throw error;
  }
};

export const optionalAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string };
      req.userId = decoded.userId;

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      req.user = user || undefined;
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};
