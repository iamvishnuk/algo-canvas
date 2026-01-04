import mongoose, { Document, Schema } from 'mongoose';
import { hashValue } from '../../../../shared/utils/Bcrypt';

export interface IUserPreferencesDocument {
  enable2FA?: boolean;
  emailNotification?: boolean;
  twoFactorSecret?: string;
}

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  userPreferences: IUserPreferencesDocument;
  createdAt: Date;
  updatedAt: Date;
}

const userPreferencesSchema = new Schema<IUserPreferencesDocument>({
  enable2FA: { type: Boolean, default: false },
  emailNotification: { type: Boolean, default: true },
  twoFactorSecret: { type: String, required: false }
});

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: false },
    userPreferences: {
      type: userPreferencesSchema,
      default: {}
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        const { password, __v, userPreferences, ...rest } = ret;
        const { twoFactorSecret, ...restPreferences } = userPreferences || {};
        return {
          ...rest,
          userPreferences: restPreferences
        };
      }
    }
  }
);

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await hashValue(this.password);
});

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
