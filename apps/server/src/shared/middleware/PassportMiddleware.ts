import passport from 'passport';
import {
  ExtractJwt,
  StrategyOptionsWithRequest,
  Strategy as JwtStrategy
} from 'passport-jwt';
import { UnauthorizedError } from '../error/Error';
import { EnvConfig } from '../config/EnvConfig';
import { UserModel } from '../../modules/users/infrastructure/persistence/UserModel';
import { UserMapper } from '../../modules/users/infrastructure/mappers/UserMapper';

interface JwtPayload {
  userId: string;
  sessionId: string;
}

const options: StrategyOptionsWithRequest = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => {
      const accessToken = req.cookies.accessToken;
      if (!accessToken) {
        throw new UnauthorizedError('Missing access token');
      }
      return accessToken;
    }
  ]),
  secretOrKey: EnvConfig.JWT_SECRET,
  audience: ['user'],
  algorithms: ['HS256'],
  passReqToCallback: true
};

// Setup JWT Strategy
passport.use(
  new JwtStrategy(options, async (req, payload: JwtPayload, done) => {
    try {
      const userDoc = await UserModel.findById(payload.userId);

      if (!userDoc) {
        return done(null, false);
      }

      const user = UserMapper.toDomain(userDoc);
      req.sessionId = payload.sessionId;
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

// Middleware for authentication
export const authenticateJWT = passport.authenticate('jwt', { session: false });

// Initialize passport
export default passport;
