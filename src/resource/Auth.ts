import bcrypt from 'bcrypt';
import { generateToken } from '../middleware/auth';
import usersResource from './Users';

export class AuthResource {
  async generateHash(password: string): Promise<string> {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
  }

  async compareHash(oldPassword: string, password: string) {
    return bcrypt.compareSync(oldPassword, password);
  }

  async authLogin({ username, password }: { username: string; password: string }) {
    const user = await usersResource.findOne({
      where: { cellPhone: username },
      include: 'account',
    });

    if (!user) throw new Error('invalid credentials');

    const checkPassword = await this.compareHash(password, user.password);

    if (!checkPassword) throw new Error('invalid credentials');

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
