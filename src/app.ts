import express, { Express } from 'express';
import { errorMiddleware } from './middleware/error.middleware';
import { loggerMiddleware } from './middleware/logger.middleware';
import { logger } from './utils/logger';
import { authRoutes } from 'routes/auth.route';
import { userRoutes } from 'routes/user.route';


export const createApp = (): Express => {
  const app = express();

  app.use(express.json());
  app.use(loggerMiddleware);

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);



  app.use(errorMiddleware);

  logger.info('Express app configured');
  return app;
};