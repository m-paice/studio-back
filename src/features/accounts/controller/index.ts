import { Router } from 'express';

import coreRouter from './core';

const router = Router();

router.use('/accounts', coreRouter);

export default router;
