import { Router } from 'express';
import { home } from '@controllers/index.controller';

const path = '/';
const router = Router();

router.get(path, home);

export default router;
