import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

interface ISpouse {
  title: string;
  gender: string;
  firstName: string;
  lastName: string;
  ageRange: string;
}

interface IUser extends Document {
  fullname: string;
  email: string;
  password: string;
  phoneNumber?: string;
  isVerified: boolean;
  title?: string;
  gender?: string;
  firstName?: string;
  lastName?: string;
  maritalStatus?: string;
  ageRange?: string;
  spouse?: ISpouse;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    fullname: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, trim: true },
    isVerified: { type: Boolean, default: false },
    title: { type: String, trim: true, enum: ['Mr', 'Mrs', 'Ms', 'Dr', 'Prof'] },
    gender: { type: String, trim: true, enum: ['Male', 'Female', 'Other'] },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    maritalStatus: { type: String, trim: true, enum: ['Single', 'Married', 'Divorced', 'Widowed'] },
    ageRange: { type: String, trim: true, enum: ['18-24', '25-34', '35-44', '45-54', '55+'] },
    spouse: {
      type: new Schema({
        title: { type: String, trim: true, enum: ['Mr', 'Mrs', 'Ms', 'Dr', 'Prof'] },
        gender: { type: String, trim: true, enum: ['Male', 'Female', 'Other'] },
        firstName: { type: String, trim: true },
        lastName: { type: String, trim: true },
        ageRange: { type: String, trim: true, enum: ['18-24', '25-34', '35-44', '45-54', '55+'] },
      }),
      default: null,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = model<IUser>('User', userSchema);