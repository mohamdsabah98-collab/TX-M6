import { Router, Request, Response } from 'express';
import { adminMiddleware } from '../middleware/auth.js';
import { prisma } from '../index.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

const router = Router();

// ========== GET USERS (Admin) ==========
router.get('/users', adminMiddleware, async (req: Request, res: Response, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    const where: any = {};

    if (search) {
      where.OR = [
        { email: { contains: search as string, mode: 'insensitive' } },
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        subscriptionTier: true,
        storageUsed: true,
        createdAt: true,
        _count: {
          select: { files: true },
        },
      },
      skip: (parseInt(page as string) - 1) * parseInt(limit as string),
      take: parseInt(limit as string),
    });

    const total = await prisma.user.count({ where });

    res.json({
      users: users.map((u) => ({
        ...u,
        fileCount: u._count.files,
      })),
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    next(error);
  }
});

// ========== GET ADMIN STATISTICS ==========
router.get('/stats/overview', adminMiddleware, async (req: Request, res: Response, next) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalFiles = await prisma.file.count();
    const totalShares = await prisma.share.count();

    const totalDownloads = await prisma.download.aggregate({
      _sum: { downloadCount: true },
    });

    const totalStorage = await prisma.user.aggregate({
      _sum: { storageUsed: true },
    });

    const premiumUsers = await prisma.user.count({
      where: { subscriptionTier: 'PREMIUM' },
    });

    res.json({
      totalUsers,
      totalFiles,
      totalShares,
      totalDownloads: totalDownloads._sum.downloadCount || 0,
      totalStorageUsed: totalStorage._sum.storageUsed || 0,
      premiumUsers,
      freeUsers: totalUsers - premiumUsers,
    });
  } catch (error) {
    next(error);
  }
});

// ========== GET DOWNLOAD ANALYTICS ==========
router.get('/analytics/downloads', adminMiddleware, async (req: Request, res: Response, next) => {
  try {
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days as string));

    const downloads = await prisma.download.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      include: {
        share: {
          include: {
            file: {
              select: {
                fileName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      period: `${days} days`,
      totalDownloads: downloads.reduce((sum, d) => sum + d.downloadCount, 0),
      downloads,
    });
  } catch (error) {
    next(error);
  }
});

// ========== GET STORAGE ANALYTICS ==========
router.get('/analytics/storage', adminMiddleware, async (req: Request, res: Response, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        storageUsed: true,
        subscriptionTier: true,
      },
      orderBy: { storageUsed: 'desc' },
      take: 20,
    });

    const totalStorage = await prisma.user.aggregate({
      _sum: { storageUsed: true },
    });

    res.json({
      topUsers: users,
      totalStorageUsed: totalStorage._sum.storageUsed || 0,
    });
  } catch (error) {
    next(error);
  }
});

// ========== SUSPEND USER (Admin) ==========
router.patch('/users/:userId/suspend', adminMiddleware, async (req: Request, res: Response, next) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { isSuspended: true },
    });

    logger.info('User suspended', { userId, email: user.email });

    res.json({ message: 'User suspended successfully' });
  } catch (error) {
    next(error);
  }
});

// ========== DELETE USER (Admin) ==========
router.delete('/users/:userId', adminMiddleware, async (req: Request, res: Response, next) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // TODO: Delete all user files from storage
    // await deleteUserFiles(userId);

    await prisma.user.delete({
      where: { id: userId },
    });

    logger.info('User deleted', { userId, email: user.email });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
