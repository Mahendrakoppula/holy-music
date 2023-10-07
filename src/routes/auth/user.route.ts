import { Router } from 'express';
import * as user from '@/controllers/user.controller';

const router = Router();
/**
 * Get All Users
 */
router.get('/user', user.getAllUsers);
/**
 * Get User by ID
 */
router.get('/user/:user_id', user.getUserById);
/**
 * Update User by ID
 */
router.get('/user/:user_id', user.getUserById);
/**
 * Delet User by ID
 */
router.delete('/user/:user_id', user.deleteUserById);
/**
 * Sign Up User
 */

router.post('/user/register', user.signUp);
/**
 * Confirm User OTP
 */
router.post('/user/confirm-otp', user.confirmOTP);
/**
 * Sign In User
 */
router.post('/user/login', user.signIn);
/**
 * Confirm Email
 */
router.get('/user/confirm-email/:token', user.signUp);
/**
 * Forgot Password
 */
router.post('/user/forgot-password', user.forgetPassword);
/**
 * Reset Password
 */
router.post('/user/reset-password', user.resetPassword);
/**
 * Log Out
 * */
router.post('/user/logout', user.logOut);

router.post('/play', user.play)

router.get('/recentlyPlayed/:userId', user.recentlyPlayed)

export default router;
