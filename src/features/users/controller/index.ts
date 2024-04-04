import { Router } from 'express';

import usersCore from './core';

const router = Router();

router.use('/users', usersCore);

export default router;
