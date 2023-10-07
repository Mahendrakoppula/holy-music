import User from '@/models/users/user.model';
import { Router } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const router = Router();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_REDIRECT_URI,
      passReqToCallback: true,
    },
    async function (req, accessToken, refreshToken, profile, done) {
      const liteProfile = {
        accessToken,
        refreshToken,
        provider: 'google',
        name: profile._json.name,
        email: profile._json.email,
        avatar: profile._json.picture,
      };
      console.log(profile);
      const user = await User.findOneAndUpdate({ email: profile._json.email }, liteProfile, { new: true, upsert: true });
      if (user) {
        return done(null, user);
      }
      // const user = await User.find({
      //   name: profile._json.name,
      //   email: profile._json.email,
      // });
      // await cookieToken<typeof user>(user, res);
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// GOOGLE LOGIN URL
router.get(
  `/google`,
  passport.authenticate('google', {
    scope: ['openid', 'profile', 'email'],
    accessType: 'offline',
  }),
);
// LOGIN SUCCESS
router.get(`/google/callback`, passport.authenticate('google', { failureRedirect: `/google/failure}`, successRedirect: '/integration/google' }));

export default router;
