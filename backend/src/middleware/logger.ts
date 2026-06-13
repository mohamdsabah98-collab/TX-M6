import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || 'unknown';

  // Log request
  logger.info(`Incoming ${method} request`, {
    method,
    url,
    ip,
    userAgent: req.get('user-agent'),
  });

  // Capture response
  const originalJson = res.json.bind(res);
  res.json = function (data: unknown) {
    const duration = Date.now() - startTime;
    logger.info(`${method} ${url} - ${res.statusCode}`, {
      status: res.statusCode,
      duration: `${duration}ms`,
    });
    return originalJson(data);
  };

  next();
};
