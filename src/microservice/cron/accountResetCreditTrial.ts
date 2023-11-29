import resource from '../../resource';
import queuedAsyncMap from '../../utils/queuedAsyncMap';

export const handleResetCreditTrial = async () => {
  const accounts = await resource.Accounts.findMany({
    where: { trial: true },
  });

  await queuedAsyncMap(accounts, async (account) => {
    await resource.Accounts.updateById(account.id, { credit: 10 });
  });
};
