import { Router } from 'express';
import vine, { errors } from '@vinejs/vine';
import { StatusCodes } from 'http-status-codes';
import { ProfileService } from '../services/profile.service.js';
import { logger } from '../utils/logger.js';
import { HttpError } from '../utils/http-error.js';

const router = Router();

// Profile schema
const profileSchema = vine.object({
  userId: vine.string(),
  title: vine.string().trim().in(['Mr', 'Mrs', 'Ms', 'Dr', 'Prof']),
  gender: vine.string().trim().in(['Male', 'Female', 'Other']),
  firstName: vine.string().trim().minLength(2),
  lastName: vine.string().trim().minLength(2),
  maritalStatus: vine.string().trim().in(['Single', 'Married', 'Divorced', 'Widowed']),
  ageRange: vine.string().trim().in(['18-24', '25-34', '35-44', '45-54', '55+']),
  spouse: vine
    .object({
      title: vine.string().trim().in(['Mr', 'Mrs', 'Ms', 'Dr', 'Prof']),
      gender: vine.string().trim().in(['Male', 'Female', 'Other']),
      firstName: vine.string().trim().minLength(2),
      lastName: vine.string().trim().minLength(2),
      ageRange: vine.string().trim().in(['18-24', '25-34', '35-44', '45-54', '55+']),
    })
    .optional(),
}).assert((data) => {
  if (data.maritalStatus === 'Married' && !data.spouse) {
    throw new Error('Spouse profile is required when marital status is Married');
  }
  if (data.maritalStatus !== 'Married' && data.spouse) {
    throw new Error('Spouse profile should only be provided when marital status is Married');
  }
});

// PATCH /api/users/profile
router.patch('/profile', async (req, res) => {
  try {
    const validator = vine.compile(profileSchema);
    const data = await validator.validate(req.body);
    const result = await ProfileService.updateProfile(data.userId, {
      title: data.title,
      gender: data.gender,
      firstName: data.firstName,
      lastName: data.lastName,
      maritalStatus: data.maritalStatus,
      ageRange: data.ageRange,
      spouse: data.spouse,
    });
    res.status(StatusCodes.OK).json(result);
  } catch (error: any) {
    logger.error('Profile update error:', error);
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ error: error.message });
    } else if (error instanceof errors.E_VALIDATION_ERROR) {
      res.status(StatusCodes.BAD_REQUEST).json({ errors: error.messages });
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message || 'Internal server error' });
    }
  }
});

export const userRoutes = router;