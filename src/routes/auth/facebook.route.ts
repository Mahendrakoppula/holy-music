import { Router } from 'express';
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';

const router = Router();
const basePath = '/facebook';
// const authController = AuthController();

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const FACEBOOK_REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI;

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: FACEBOOK_REDIRECT_URI,
      profileFields: ['id', 'displayName', 'photos', 'email'],
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile._json);
      return cb(null, profile);
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
router.get(`${basePath}`, passport.authenticate('facebook'));
// LOGIN SUCCESS
router.get(
  `${basePath}/callback`,
  passport.authenticate('facebook', { failureRedirect: `${basePath}/failure`, successRedirect: '/integration/facebook/' }),
);

export default router;
 