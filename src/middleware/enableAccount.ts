import { Request, Response, NextFunction } from 'express';

import resource from '../resource';

export const enableAccount = async (req: Request, res: Response, next: NextFunction) => {
  const account = await resource.Accounts.findById(req.accountId);

  if (account.trial || account.enable) return next();

  return res.sendStatus(401);
};
