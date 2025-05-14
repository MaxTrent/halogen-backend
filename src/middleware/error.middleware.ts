import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CustomError } from '../utils/custom-error';
import { logger } from '../utils/logger';

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error occurred:', error);
  if (error instanceof CustomError) {
    res.status(error.statusCode).json({ error: error.message });
  } else if (error instanceof Error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
  next();
};