import { Router, Request, Response } from 'express';
import { optionalAuthMiddleware } from '../middleware/auth.js';
import { prisma } from '../index.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

const router = Router();

// ========== GET DOWNLOAD PAGE ==========
router.get('/:shareId', optionalAuthMiddleware, async (req: Request, res: Response, next) => {
  try {
    const { shareId } = req.params;
    const { password } = req.query;

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
      throw new AppError(404, 'Download link not found');
    }

    // Check expiration
    if (share.expiresAt && new Date(share.expiresAt) < new Date()) {
      throw new AppError(410, 'Download link has expired');
    }

    // Check password
    if (share.password && share.password !== password) {
      throw new AppError(401, 'Invalid password');
    }

    // Increment download count
    await prisma.download.upsert({
      where: { shareId },
      create: {
        shareId,
        downloadCount: 1,
      },
      update: {
        downloadCount: {
          increment: 1,
        },
      },
    });

    logger.info('Download initiated', { shareId, fileName: share.file.fileName });

    res.json({
      file: {
        id: share.file.id,
        fileName: share.file.fileName,
        fileSize: share.file.fileSize,
        fileType: share.file.fileType,
        uploadedAt: share.file.createdAt,
        uploader: `${share.file.user.firstName} ${share.file.user.lastName}`,
      },
      downloadLink: `/api/download/${shareId}/file`,
    });
  } catch (error) {
    next(error);
  }
});

// ========== DOWNLOAD FILE ==========
router.get('/:shareId/file', optionalAuthMiddleware, async (req: Request, res: Response, next) => {
  try {
    const { shareId } = req.params;
    const { password } = req.query;

    const share = await prisma.share.findUnique({
      where: { id: shareId },
      include: {
        file: true,
      },
    });

    if (!share) {
      throw new AppError(404, 'Download link not found');
    }

    // Check expiration
    if (share.expiresAt && new Date(share.expiresAt) < new Date()) {
      throw new AppError(410, 'Download link has expired');
    }

    // Check password
    if (share.password && share.password !== password) {
      throw new AppError(401, 'Invalid password');
    }

    // TODO: Implement file download from storage
    // const fileStream = await getFileFromStorage(share.file.storagePath);
    // res.setHeader('Content-Type', share.file.fileType);
    // res.setHeader('Content-Disposition', `attachment; filename="${share.file.fileName}"`);
    // fileStream.pipe(res);

    res.json({
      message: 'Download initiated',
      downloadUrl: `https://storage.example.com/${share.file.storagePath}`,
    });
  } catch (error) {
    next(error);
  }
});

// ========== GET DOWNLOAD STATS ==========
router.get('/:shareId/stats', optionalAuthMiddleware, async (req: Request, res: Response, next) => {
  try {
    const { shareId } = req.params;

    const share = await prisma.share.findUnique({
      where: { id: shareId },
      include: {
        _count: {
          select: { downloads: true },
        },
      },
    });

    if (!share) {
      throw new AppError(404, 'Download link not found');
    }

    res.json({
      downloadCount: share._count.downloads || 0,
      createdAt: share.createdAt,
      expiresAt: share.expiresAt,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
