import resource from '../../../resource';

interface User {
  name: string;
  phone: string;
}

interface Request {
  user: User;
  accountId: string;
}

function removePrefixIfPresent(phoneNumber) {
  const regex = /^(55|\+55)/;

  if (regex.test(phoneNumber)) {
    const numberWithoutPrefix = phoneNumber.replace(regex, '');

    return numberWithoutPrefix;
  }

  return phoneNumber;
}

export async function importUsers({ user, accountId }: Request) {
  const cellPhone = (user.phone.match(/\d+/g) || []).join('');
  const cellPhoneFormated = removePrefixIfPresent(cellPhone);

  const userExist = await resource.Users.findOne({
    where: { accountId, name: user.name, cellPhone: cellPhoneFormated },
  });

  if (!userExist) {
    await resource.Users.create({
      accountId,
      name: user.name,
      cellPhone: cellPhoneFormated,
      type: 'pf',
    });
  }
}
