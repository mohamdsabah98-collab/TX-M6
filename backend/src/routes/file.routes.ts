import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { prisma } from '../index.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import { isAllowedFileType, isValidFileSize } from '../utils/validators.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// ========== UPLOAD FILE ==========
router.post('/upload', authMiddleware, upload.single('file'), async (req: Request, res: Response, next) => {
  try {
    if (!req.file) {
      throw new AppError(400, 'No file provided');
    }

    const { fileName, folderId } = req.body;
    const file = req.file;

    // Validate file
    if (!isValidFileSize(file.size)) {
      throw new AppError(413, 'File size exceeds maximum limit');
    }

    if (!isAllowedFileType(file.originalname)) {
      throw new AppError(415, 'File type not allowed');
    }

    // Check user storage quota
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const storageLimit =
      user.subscriptionTier === 'PREMIUM'
        ? parseInt(process.env.PREMIUM_STORAGE_LIMIT || '1099511627776')
        : parseInt(process.env.FREE_STORAGE_LIMIT || '5368709120');

    if (user.storageUsed + file.size > storageLimit) {
      throw new AppError(507, 'Storage quota exceeded');
    }

    // Generate file ID
    const fileId = uuidv4();
    const storagePath = `${req.userId}/${fileId}`;

    // TODO: Upload to Cloudflare R2 or AWS S3
    // const uploadedFile = await uploadToStorage(file, storagePath);

    // Create file record
    const createdFile = await prisma.file.create({
      data: {
        id: fileId,
        fileName: fileName || file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        storagePath,
        userId: req.userId,
        folderId: folderId || null,
      },
    });

    // Update user storage
    await prisma.user.update({
      where: { id: req.userId },
      data: { storageUsed: user.storageUsed + file.size },
    });

    logger.info('File uploaded', { fileId, fileName: file.originalname, size: file.size });

    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        id: createdFile.id,
        fileName: createdFile.fileName,
        fileSize: createdFile.fileSize,
        fileType: createdFile.fileType,
        uploadedAt: createdFile.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ========== LIST FILES ==========
router.get('/', authMiddleware, async (req: Request, res: Response, next) => {
  try {
    const { folderId, search, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 20 } = req.query;

    const where: any = { userId: req.userId };

    if (folderId) {
      where.folderId = folderId;
    } else {
      where.folderId = null; // Root files only
    }

    if (search) {
      where.fileName = {
        contains: search as string,
        mode: 'insensitive',
      };
    }

    const files = await prisma.file.findMany({
      where,
      select: {
        id: true,
        fileName: true,
        fileSize: true,
        fileType: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { shares: true },
        },
      },
      orderBy: { [sortBy as string]: sortOrder },
      skip: (parseInt(page as string) - 1) * parseInt(limit as string),
      take: parseInt(limit as string),
    });

    const total = await prisma.file.count({ where });

    res.json({
      files: files.map((f) => ({
        ...f,
        shareCount: f._count.shares,
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

// ========== GET FILE DETAILS ==========
router.get('/:fileId', authMiddleware, async (req: Request, res: Response, next) => {
  try {
    const { fileId } = req.params;

    const file = await prisma.file.findFirst({
      where: { id: fileId, userId: req.userId },
      include: {
        _count: {
          select: { shares: true },
        },
      },
    });

    if (!file) {
      throw new AppError(404, 'File not found');
    }

    res.json({
      file: {
        ...file,
        shareCount: file._count.shares,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ========== RENAME FILE ==========
router.patch('/:fileId/rename', authMiddleware, async (req: Request, res: Response, next) => {
  try {
    const { fileId } = req.params;
    const { fileName } = req.body;

    if (!fileName) {
      throw new AppError(400, 'New file name is required');
    }

    const file = await prisma.file.findFirst({
      where: { id: fileId, userId: req.userId },
    });

    if (!file) {
      throw new AppError(404, 'File not found');
    }

    const updatedFile = await prisma.file.update({
      where: { id: fileId },
      data: { fileName },
    });

    logger.info('File renamed', { fileId, oldName: file.fileName, newName: fileName });

    res.json({
      message: 'File renamed successfully',
      file: {
        id: updatedFile.id,
        fileName: updatedFile.fileName,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ========== DELETE FILE ==========
router.delete('/:fileId', authMiddleware, async (req: Request, res: Response, next) => {
  try {
    const { fileId } = req.params;

    const file = await prisma.file.findFirst({
      where: { id: fileId, userId: req.userId },
    });

    if (!file) {
      throw new AppError(404, 'File not found');
    }

    // TODO: Delete from storage (R2/S3)
    // await deleteFromStorage(file.storagePath);

    await prisma.file.delete({
      where: { id: fileId },
    });

    // Update user storage
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (user) {
      await prisma.user.update({
        where: { id: req.userId },
        data: { storageUsed: Math.max(0, user.storageUsed - file.fileSize) },
      });
    }

    logger.info('File deleted', { fileId, fileName: file.fileName });

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// ========== CREATE FOLDER ==========
router.post('/folder/create', authMiddleware, async (req: Request, res: Response, next) => {
  try {
    const { folderName, parentFolderId } = req.body;

    if (!folderName) {
      throw new AppError(400, 'Folder name is required');
    }

    const folderId = uuidv4();

    const folder = await prisma.folder.create({
      data: {
        id: folderId,
        name: folderName,
        userId: req.userId,
        parentFolderId: parentFolderId || null,
      },
    });

    logger.info('Folder created', { folderId, folderName });

    res.status(201).json({
      message: 'Folder created successfully',
      folder: {
        id: folder.id,
        name: folder.name,
        createdAt: folder.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ========== LIST FOLDERS ==========
router.get('/folders/list', authMiddleware, async (req: Request, res: Response, next) => {
  try {
    const { parentFolderId } = req.query;

    const where: any = { userId: req.userId };

    if (parentFolderId) {
      where.parentFolderId = parentFolderId;
    } else {
      where.parentFolderId = null;
    }

    const folders = await prisma.folder.findMany({
      where,
      select: {
        id: true,
        name: true,
        createdAt: true,
        _count: {
          select: {
            files: true,
            children: true,
          },
        },
      },
    });

    res.json({
      folders: folders.map((f) => ({
        id: f.id,
        name: f.name,
        fileCount: f._count.files,
        subfolderCount: f._count.children,
        createdAt: f.createdAt,
      })),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
