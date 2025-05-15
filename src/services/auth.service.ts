import { StatusCodes } from 'http-status-codes';
import twilio from 'twilio';
import { User } from '../models/user.model';
import { initializeConfig } from '../config/env';
import { logger } from '../utils/logger';
import { HttpError } from 'utils/http-error';
import { Otp } from 'models/otp.model';

export class AuthService {
  private static async getConfig() {
    return initializeConfig();
  }

  // Generate 4-digit OTP
  static generateOtp(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  // Send OTP via Twilio SMS
  static async sendOtpSms(phoneNumber: string, otp: string): Promise<void> {
    const config = await this.getConfig();
    const client = twilio(config.twilioAccountSid, config.twilioAuthToken);

    try {
      await client.messages.create({
        body: `Your Halogen verification code is ${otp}. It expires in 10 minutes.`,
        from: config.twilioPhoneNumber,
        to: phoneNumber,
      });
      logger.info(`OTP sent to ${phoneNumber}`);
    } catch (error: any) {
      logger.error(`Failed to send OTP to ${phoneNumber}:`, error);
      throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to send OTP');
    }
  }

  // Register user with phone number and send OTP
  static async signup(fullname: string, email: string, password: string, phoneNumber: string) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new HttpError(StatusCodes.CONFLICT, 'Email already exists');
    }

    const user = new User({ fullname, email, password, phoneNumber });
    await user.save();

    const otp = this.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await Otp.deleteMany({ userId: user._id }); // Clear previous OTPs
    const otpDoc = new Otp({ userId: user._id, otpHash: otp, expiresAt });
    await otpDoc.save();

    await this.sendOtpSms(phoneNumber, otp);
    logger.info(`User registered and OTP sent: ${email}`);
    return { userId: user._id };
  }

  // Verify OTP
  static async verifyOtp(userId: string, otp: string) {
    const otpDoc = await Otp.findOne({ userId });
    if (!otpDoc) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'Invalid or expired OTP');
    }

    const isValid = await otpDoc.compareOtp(otp);
    if (!isValid) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'Invalid OTP');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'User not found');
    }

    user.isVerified = true;
    await user.save();
    await Otp.deleteMany({ userId });

    logger.info(`OTP verified for user ${userId}`);
    return { message: 'User verified successfully' };
  }
}