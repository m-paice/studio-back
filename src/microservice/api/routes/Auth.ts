import { Router } from 'express';

import AuthResource from '../../../resource/Auth';

import { promiseHandler } from '../../../utils/routing';

const router = Router();

const controllerCustom = {
  authLogin: promiseHandler(async (req) => {
    const { username, password } = req.body;

    const response = await AuthResource.authLogin({ username, password });

    return response;
  }),
  resetPassword: promiseHandler(async (req) => {
    const { cellPhone, oldPassword, newPassword } = req.body;

    const response = await AuthResource.resetPassword({
      cellPhone,
      oldPassword,
      newPassword,
    });

    return response;
  }),
};

router.post('/', controllerCustom.authLogin);
router.post('/reset-password', controllerCustom.resetPassword);

export default router;
