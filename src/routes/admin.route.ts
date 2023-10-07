import { Router } from 'express';
import * as admin from '@/controllers/admin.controller';
import * as user from "@/controllers/user.controller";


const router = Router();

/**
 *  admin
 */

router.post('/admin/register', admin.Admin_signUp);
router.post('/admin/login', admin.Admin_signIn);

router.get('/admin',admin.getAllAdmin);
router.get('/admin/:id',admin.getAdminById);


// router.post('/admin/logout', admin.logout);

router.get('/getallusers',user.getAllUsers);
router.get('/admin/usersid/:user_id',user.getUserById);
router.delete('/UserDelete/:phone',user.deleteUserById);

export default router;