import { Router } from 'express';

import notificationsResource from '../../../resource/Notifications';

import controllerDefaut from '../controller';
import { accountContext } from '../../../middleware/accountContext';

const controller = controllerDefaut(notificationsResource);

const router = Router();

router.use(accountContext);

router.get('/', controller.index);

export default router;
