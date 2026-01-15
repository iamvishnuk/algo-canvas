import mongoose, { Document, Schema } from 'mongoose';

export interface IUserPreferencesDocument {
  enable2FA?: boolean;
  emailNotification?: boolean;
  twoFactorSecret?: string;
}

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password?: string;
  isEmailVerified: boolean;
  googleId?: string;
  provider?: 'google' | 'local';
  avatar?: string;
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
    password: { type: String, required: false },
    googleId: { type: String, required: false, unique: true },
    isEmailVerified: { type: Boolean, default: false },
    provider: { type: String, enum: ['google', 'local'], default: 'local' },
    avatar: { type: String, required: false },
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

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
