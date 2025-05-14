import vine, { errors } from '@vinejs/vine';
import dotenv from 'dotenv';
import path from 'path';
import { logger } from '../utils/logger';

// Resolve .env path relative to src/config/
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

// Define TypeScript interface for environment variables
interface EnvVars {
  NODE_ENV: 'development' | 'production';
  DB_CONNECTION_URL: string;
  PORT: number;
}

// Define VineJS schema
const envSchema = vine.object({
  NODE_ENV: vine
    .enum(['development', 'production'])
    .optional()
    .transform((value: string | undefined) => value ?? 'development'),
  DB_CONNECTION_URL: vine.string().trim(),
  PORT: vine
    .number()
    .positive()
    .optional()
    .transform((value: number | undefined) => value ?? 3000),
});

// Validate environment variables asynchronously
export const config = await (async () => {
  try {
    const validator = vine.compile(envSchema);
    const envVars = await validator.validate(process.env) as EnvVars;
    logger.info('Environment variables validated successfully');
    return {
      env: envVars.NODE_ENV,
      port: envVars.PORT,
      database: {
        url: envVars.DB_CONNECTION_URL,
      },
    };
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      logger.error(`Environment validation error: ${JSON.stringify(error.messages, null, 2)}`);
    } else {
      logger.error('Unexpected environment configuration error:', error);
    }
    process.exit(1);
  }
})();