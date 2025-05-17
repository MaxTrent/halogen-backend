import { StatusCodes } from 'http-status-codes';
import { User } from '../models/user.model.js';
import { logger } from '../utils/logger.js';
import { HttpError } from '../utils/http-error.js';

interface SpouseProfile {
  title: string;
  gender: string;
  firstName: string;
  lastName: string;
  ageRange: string;
}

interface UserProfile {
  title: string;
  gender: string;
  firstName: string;
  lastName: string;
  maritalStatus: string;
  ageRange: string;
  spouse?: SpouseProfile;
}

export class ProfileService {
  static async updateProfile(userId: string, profileData: UserProfile) {
    const user = await User.findById(userId);
    if (!user) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'User not found');
    }
    if (!user.isVerified) {
      throw new HttpError(StatusCodes.FORBIDDEN, 'User not verified');
    }

    // Update user profile fields
    user.title = profileData.title;
    user.gender = profileData.gender;
    user.firstName = profileData.firstName;
    user.lastName = profileData.lastName;
    user.maritalStatus = profileData.maritalStatus;
    user.ageRange = profileData.ageRange;

    // Handle spouse profile
    if (profileData.maritalStatus === 'Married' && profileData.spouse) {
      user.spouse = {
        title: profileData.spouse.title,
        gender: profileData.spouse.gender,
        firstName: profileData.spouse.firstName,
        lastName: profileData.spouse.lastName,
        ageRange: profileData.spouse.ageRange,
      };
    } else {
      user.spouse = null; // Clear spouse if not married
    }

    await user.save();
    logger.info(`Profile updated for user ${userId}`);
    return { message: 'Profile updated successfully' };
  }
}