import { Router } from 'express';

import Resource from '../../../resource';
import { promiseHandler } from '../../../utils/routing';

const controllerCustom = {
  users: promiseHandler(async () => Resource.Admin.users()),
  accounts: promiseHandler(async () => Resource.Admin.accounts()),
};

const router = Router();

router.get('/users', controllerCustom.users);
router.get('/accounts', controllerCustom.accounts);

export default router;
