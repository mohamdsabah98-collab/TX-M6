import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { prisma } from '../index.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// ========== GET USER PROFILE ==========
router.get('/profile', authMiddleware, async (req: Request, res: Response, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profilePicture: true,
        role: true,
        subscriptionTier: true,
        storageUsed: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const freeStorageLimit = parseInt(process.env.FREE_STORAGE_LIMIT || '5368709120');
    const premiumStorageLimit = parseInt(process.env.PREMIUM_STORAGE_LIMIT || '1099511627776');
    const storageLimit = user.subscriptionTier === 'PREMIUM' ? premiumStorageLimit : freeStorageLimit;

    res.json({
      user,
      storage: {
        used: user.storageUsed,
        limit: storageLimit,
        percentage: (user.storageUsed / storageLimit) * 100,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ========== UPDATE PROFILE ==========
router.put('/profile', authMiddleware, async (req: Request, res: Response, next) => {
  try {
    const { firstName, lastName, profilePicture } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(profilePicture && { profilePicture }),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profilePicture: true,
      },
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
});

// ========== GET STORAGE INFO ==========
router.get('/storage', authMiddleware, async (req: Request, res: Response, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        storageUsed: true,
        subscriptionTier: true,
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const freeStorageLimit = parseInt(process.env.FREE_STORAGE_LIMIT || '5368709120');
    const premiumStorageLimit = parseInt(process.env.PREMIUM_STORAGE_LIMIT || '1099511627776');
    const storageLimit = user.subscriptionTier === 'PREMIUM' ? premiumStorageLimit : freeStorageLimit;

    res.json({
      storageUsed: user.storageUsed,
      storageLimit,
      storagePercentage: (user.storageUsed / storageLimit) * 100,
      subscriptionTier: user.subscriptionTier,
    });
  } catch (error) {
    next(error);
  }
});

// ========== GET USER STATISTICS ==========
router.get('/stats', authMiddleware, async (req: Request, res: Response, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const totalFiles = await prisma.file.count({
      where: { userId: req.userId },
    });

    const totalDownloads = await prisma.download.aggregate({
      where: { file: { userId: req.userId } },
      _sum: { downloadCount: true },
    });

    const totalShares = await prisma.share.count({
      where: { file: { userId: req.userId } },
    });

    res.json({
      totalFiles,
      totalDownloads: totalDownloads._sum.downloadCount || 0,
      totalShares,
      storageUsed: user.storageUsed,
      subscriptionTier: user.subscriptionTier,
      memberSince: user.createdAt,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
