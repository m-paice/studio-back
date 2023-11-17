import { Op } from 'sequelize';
import bcrypt from 'bcryptjs';

import { generateToken } from '../middleware/auth';
import usersResource from './Users';
import { HttpError } from '../utils/error/HttpError';

export class AuthResource {
  async generateHash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async compareHash(oldPassword: string, password: string) {
    return bcrypt.compare(oldPassword, password);
  }

  async authLogin({ username, password }: { username: string; password: string }) {
    const user = await usersResource.findOne({
      where: {
        cellPhone: username,
        password: {
          [Op.ne]: null as any,
        },
      },
      include: 'account',
    });
    if (!user) throw new HttpError(401, 'invalid credentials');

    const checkPassword = await this.compareHash(password, user.password);
    if (!checkPassword) throw new HttpError(401, 'invalid credentials');

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

    if (!hasUser) throw new HttpError(500, 'user not found');

    await usersResource.updateById(hasUser.id, {
      password: newPassword,
    });

    return true;
  }
}

export default new AuthResource();
