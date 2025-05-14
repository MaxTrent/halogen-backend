import { Document, Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { toJSON } from "../../../models/plugins/toJSON";


export interface IUser extends Document {
    name: string;
  email: string;
  password: string;
  phone_number: string;
  created_at: Date;
  updated_at: Date;
  disabled: Boolean;
  last_login: Date;
  last_password_reset: Date;
  fcm_device_token: string;
  isPasswordMatch(password: string): Promise<boolean>;
}

const userSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8, private: true }, // `private: true` used by the toJSON plugin
    phone_number: { type: String, unique: true, sparse: true },
    disabled: { type: Boolean, default: false },
    last_login: { type: Date },
    last_password_reset: { type: Date },
    fcm_device_token: { type: String }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);


userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 8);
    }
    next();
  });
// add plugin that converts document to json
userSchema.plugin(toJSON);

userSchema.methods.isPasswordMatch = async function (password: string) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

const User = model<IUser>("User", userSchema);

export default User;
