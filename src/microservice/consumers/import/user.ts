import resource from '../../../resource';

interface User {
  name: string;
  phone: string;
}

interface Request {
  user: User;
  accountId: string;
}

export async function importUsers({ user, accountId }: Request) {
  const cellPhone = (user.phone.match(/\d+/g) || []).join('');

  const userExist = await resource.Users.findOne({ where: { accountId, name: user.name, cellPhone } });

  if (!userExist) {
    await resource.Users.create({
      accountId,
      name: user.name,
      cellPhone,
      type: 'pf',
    });
  }
}
