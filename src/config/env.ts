import vine, { errors } from '@vinejs/vine';
import dotenv from 'dotenv';
import { logger } from 'utils/logger.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Check for required environment variables
if (!process.env.DB_CONNECTION_URL) {
    logger.error('DB_CONNECTION_URL is not defined in .env file');
    process.exit(1);
  }

// Define TypeScript interface for environment variables
interface EnvVars {
  NODE_ENV: 'development' | 'production';
  DB_CONNECTION_URL: string;
  PORT: number;
}

// Define VineJS schema
const envSchema = vine.object({
  NODE_ENV: vine.enum(['development', 'production']).optional().transform((value: string | undefined) => value ?? 'development'),
  DB_CONNECTION_URL: vine.string().trim(),
  PORT: vine.number().positive().optional().transform((value: string | undefined) => value),
});

let cachedConfig: { env: string; port: number; dbUrl: string } | null = null;

// Validate environment variables asynchronously
export async function initializeConfig() {
    if (cachedConfig) {
        return cachedConfig;
      }

    try {
      const validator = vine.compile(envSchema);
      const envVars = await validator.validate(process.env) as EnvVars;
      logger.info('Environment variables validated successfully');
      cachedConfig = {
        env: envVars.NODE_ENV,
        port: envVars.PORT,
        dbUrl: envVars.DB_CONNECTION_URL,
      };
      return cachedConfig;
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        logger.error(`Environment validation error: ${JSON.stringify(error.messages, null, 2)}`);
      } else {
        logger.error('Unexpected environment configuration error:', error);
      }
      process.exit(1);
    }
  }