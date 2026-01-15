import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { EnvConfig } from '../config/EnvConfig';
import { UserModel } from '../../modules/users/infrastructure/persistence/UserModel';
import { UserMapper } from '../../modules/users/infrastructure/mappers/UserMapper';

passport.use(
  new GoogleStrategy(
    {
      clientID: EnvConfig.GOOGLE_CLIENT_ID,
      clientSecret: EnvConfig.GOOGLE_CLIENT_SECRET,
      callbackURL: EnvConfig.GOOGLE_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log({ accessToken, refreshToken, profile });
      try {
        let userDoc = await UserModel.findOne({ googleId: profile.id });
        if (!userDoc) {
          userDoc = await UserModel.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value,
            avatar: profile.photos?.[0]?.value,
            isEmailVerified: true,
            provider: 'google'
          });
        }
        const user = UserMapper.toDomain(userDoc);
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export const authenticateGoogle = passport.authenticate('google', {
  scope: ['profile', 'email']
});

export const authenticateGoogleCallback = passport.authenticate('google', {
  session: false,
  failureRedirect: '/sign-in'
});
