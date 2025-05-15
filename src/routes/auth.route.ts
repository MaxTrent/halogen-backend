import { Router } from 'express';
import vine, { errors } from '@vinejs/vine';
import { StatusCodes } from 'http-status-codes';
import { AuthService } from '../services/auth.service.js';
import { logger } from '../utils/logger.js';
import { HttpError } from 'utils/http-error.js';

const router = Router();

// Sign-up schema
const signupSchema = vine.object({
  fullname: vine.string().trim().minLength(2),
  email: vine.string().email().trim(),
  password: vine.string().minLength(8),
  phoneNumber: vine.string().trim().regex(/^\+?[1-9]\d{1,14}$/), // E.164 format
});

// OTP schema
const otpSchema = vine.object({
  userId: vine.string(),
  otp: vine.string().trim().fixedLength(4).regex(/^\d{4}$/),
});

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const validator = vine.compile(signupSchema);
    const data = await validator.validate(req.body);
    const result = await AuthService.signup(data.fullname, data.email, data.password, data.phoneNumber);
    res.status(StatusCodes.CREATED).json(result);
  } catch (error: any) {
    logger.error('Signup error:', error);
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ error: error.message });
    } else if (error instanceof errors.E_VALIDATION_ERROR) {
      res.status(StatusCodes.BAD_REQUEST).json({ errors: error.messages });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const validator = vine.compile(otpSchema);
    const data = await validator.validate(req.body);
    const result = await AuthService.verifyOtp(data.userId, data.otp);
    res.status(StatusCodes.OK).json(result);
  } catch (error: any) {
    logger.error('OTP verification error:', error);
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ error: error.message });
    } else if (error instanceof errors.E_VALIDATION_ERROR) {
      res.status(StatusCodes.BAD_REQUEST).json({ errors: error.messages });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
    }
  }
});

export const authRoutes = router;