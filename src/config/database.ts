import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import { config } from './env';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.database.url);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};