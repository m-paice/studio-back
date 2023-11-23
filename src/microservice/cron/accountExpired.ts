import { Op } from 'sequelize';

import resource from '../../resource';
import queuedAsyncMap from '../../utils/queuedAsyncMap';
import { sendMessageDiscord } from '../../services/discord';

export const handleAccountExpired = async () => {
  const today = new Date();

  const accounts = await resource.Accounts.findMany({
    where: {
      trial: true,
      dueDate: {
        [Op.and]: {
          [Op.not]: null,
          [Op.lt]: today,
        },
      },
    },
  });

  await queuedAsyncMap(accounts, async (account) => {
    await resource.Accounts.updateById(account.id, {
      trial: false,
      dueDate: null,
      enable: false,
    });
    await sendMessageDiscord({ message: `is account ${account.name} is trial and expired` });
  });
};
