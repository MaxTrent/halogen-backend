
import { createApp } from './app';
import { connectDB } from './config/database';
import { config } from './config/env';
import { logger } from './utils/logger';

const startServer = async () => {
  try {
    await connectDB();
    const app = createApp();
    app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();