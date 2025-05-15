import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import { initializeConfig } from './env';

export const connectDB = async (): Promise<void> => {
  try {
    const config = await initializeConfig();
    await mongoose.connect(config.dbUrl);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};