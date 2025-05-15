import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcrypt';

interface IOtp extends Document {
  userId: Types.ObjectId;
  otpHash: string;
  expiresAt: Date;
  compareOtp(otp: string): Promise<boolean>;
}

const otpSchema = new Schema<IOtp>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    otpHash: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: '0s' } },
  },
  { timestamps: true }
);

// Hash OTP before saving
otpSchema.pre('save', async function (next) {
  if (!this.isModified('otpHash')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.otpHash = await bcrypt.hash(this.otpHash, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare OTP method
otpSchema.methods.compareOtp = async function (otp: string): Promise<boolean> {
  return bcrypt.compare(otp, this.otpHash);
};

export const Otp = model<IOtp>('Otp', otpSchema);