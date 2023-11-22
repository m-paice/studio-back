import { Router } from 'express';

import controllerDefaut from '../controller';
import { accountContext } from '../../../middleware/accountContext';
import resource from '../../../resource';
import { onlyAdmin } from '../../../middleware/onlyAdmin';

const whiteList = ['account', 'user'];

const controller = controllerDefaut(resource.Billings, whiteList);

const router = Router();

router.use(accountContext);
router.use(onlyAdmin);

router.get('/', controller.index);

export default router;
