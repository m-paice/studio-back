import { Router } from 'express';
import { generateToken } from '../../../middleware/auth';

import usersResource from '../../../resource/Users';
import { promiseHandler } from '../../../utils/routing';

const router = Router();

const controllerCustom = {
  authLogin: promiseHandler(async (req) => {
    const { username, password } = req.body;

    const user = await usersResource.findOne({
      where: { cellPhone: username, password },
      include: 'account',
    });

    if (!user) throw new Error('invalid credentials');

    const token = generateToken({
      userId: user.id,
      accountId: user.accountId,
      isSuperAdmin: user.isSuperAdmin,
    });

    return {
      token,
      user,
    };
  }),
};

router.post('/', controllerCustom.authLogin);

export default router;
