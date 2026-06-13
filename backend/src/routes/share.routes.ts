import { Router, Request, Response } from 'express';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.js';
import { prisma } from '../index.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// ========== GENERATE SHARE LINK ==========
router.post('/:fileId/generate', authMiddleware, async (req: Request, res: Response, next) => {
  try {
    const { fileId } = req.params;
    const { isPublic, password, expiresAt } = req.body;

    // Verify file ownership
    const file = await prisma.file.findFirst({
      where: { id: fileId, userId: req.userId },
    });

    if (!file) {
      throw new AppError(404, 'File not found or you do not have access');
    }

    // Generate unique share ID
    const shareId = uuidv4();

    const share = await prisma.share.create({
      data: {
        id: shareId,
        fileId,
        isPublic: isPublic || false,
        password: password || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    const shareLink = `${process.env.FRONTEND_URL}/download/${shareId}`;

    logger.info('Share link generated', { fileId, shareId });

    res.status(201).json({
      message: 'Share link generated successfully',
      share: {
        id: share.id,
        shareLink,
        isPublic: share.isPublic,
        hasPassword: !!share.password,
        expiresAt: share.expiresAt,
        createdAt: share.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ========== GET SHARE INFO (Public) ==========
router.get('/:shareId/info', optionalAuthMiddleware, async (req: Request, res: Response, next) => {
  try {
    const { shareId } = req.params;

    const share = await prisma.share.findUnique({
      where: { id: shareId },
      include: {
        file: {
          select: {
            id: true,
            fileName: true,
            fileSize: true,
            fileType: true,
            createdAt: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    if (!share) {
      throw new AppError(404, 'Share link not found');
    }

    // Check if share is expired
    if (share.expiresAt && new Date(share.expiresAt) < new Date()) {
      throw new AppError(410, 'Share link has expired');
    }

    // Check if public or user owns it
    if (!share.isPublic && share.file.userId !== req.userId) {
      throw new AppError(403, 'Access denied');
    }

    res.json({
      share: {
        id: share.id,
        hasPassword: !!share.password,
        expiresAt: share.expiresAt,
        file: share.file,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ========== LIST SHARES FOR FILE ==========
router.get('/file/:fileId', authMiddleware, async (req: Request, res: Response, next) => {
  try {
    const { fileId } = req.params;

    // Verify file ownership
    const file = await prisma.file.findFirst({
      where: { id: fileId, userId: req.userId },
    });

    if (!file) {
      throw new AppError(404, 'File not found');
    }

    const shares = await prisma.share.findMany({
      where: { fileId },
      select: {
        id: true,
        isPublic: true,
        hasPassword: true,
        expiresAt: true,
        createdAt: true,
        _count: {
          select: { downloads: true },
        },
      },
    });

    res.json({
      shares: shares.map((share) => ({
        id: share.id,
        shareLink: `${process.env.FRONTEND_URL}/download/${share.id}`,
        isPublic: share.isPublic,
        hasPassword: !!share.hasPassword,
        expiresAt: share.expiresAt,
        downloadCount: share._count.downloads,
        createdAt: share.createdAt,
      })),
    });
  } catch (error) {
    next(error);
  }
});

// ========== DELETE SHARE LINK ==========
router.delete('/:shareId', authMiddleware, async (req: Request, res: Response, next) => {
  try {
    const { shareId } = req.params;

    const share = await prisma.share.findUnique({
      where: { id: shareId },
      include: { file: true },
    });

    if (!share) {
      throw new AppError(404, 'Share link not found');
    }

    if (share.file.userId !== req.userId) {
      throw new AppError(403, 'Access denied');
    }

    await prisma.share.delete({
      where: { id: shareId },
    });

    logger.info('Share link deleted', { shareId });

    res.json({ message: 'Share link deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
