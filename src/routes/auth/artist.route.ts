import { Router } from 'express';
import * as artist from '@/controllers/artist.controller';

const router = Router();
/**
 * Get All artist
 */
router.get('/artist', artist.getAllartists);
/**
 * Get artist by ID
 */
router.get('/artist/:artist_id', artist.getartistById);
/**
 * Update artist by ID
 */
router.get('/artist/:artist_id', artist.getartistById);
/**
 * Delet artist by ID
 */
router.delete('/artist/:artist_id', artist.deleteartistById);
/**
 * Sign Up artist
 */

router.post('/artist/register', artist.signUp);
/**
 * Confirm artist OTP
 */
router.post('/artist/confirm-otp', artist.confirmOTP);
/**
 * Sign In artist
 */
router.post('/artist/login', artist.signIn);
/**
 * Confirm Email
 */
router.get('/artist/confirm-email/:token', artist.signUp);
/**
 * Forgot Password
 */
router.post('/artist/forgot-password', artist.forgetPassword);
/**
 * Reset Password
 */
router.post('/artist/reset-password', artist.resetPassword);
/**
 * Log Out
 * */
router.post('/artist/logout', artist.logOut);

router.post('/play', artist.play)

router.get('/recentlyPlayed/:artistId', artist.recentlyPlayed)

export default router;
