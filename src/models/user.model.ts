import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';

export interface IUser extends Document {
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
}, { timestamps: true });

export const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(1).optional(),
});

export const User = mongoose.model<IUser>('User', UserSchema);