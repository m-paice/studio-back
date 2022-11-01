import { generateToken } from '../middleware/auth';
import usersResource from './Users';

export class AuthResource {
  async authLogin({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
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
  }

  async resetPassword({
    cellPhone,
    oldPassword,
    newPassword,
  }: {
    cellPhone: string;
    oldPassword: string;
    newPassword: string;
  }) {
    const hasUser = await usersResource.findOne({
      where: {
        cellPhone,
        password: oldPassword,
      },
    });

    if (!hasUser) throw new Error('user not found');

    await usersResource.updateById(hasUser.id, {
      password: newPassword,
    });

    return true;
  }
}

export default new AuthResource();
