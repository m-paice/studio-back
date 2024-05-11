import { Router } from 'express';

import servicesCore from './core';

const router = Router();

router.use('/services', servicesCore);

export default router;
