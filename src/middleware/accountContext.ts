import { NextFunction, Request, Response } from 'express';

export function accountContext(req: Request, res: Response, next: NextFunction) {
  if (!req.accountId) return next();

  req.query = {
    ...req?.query,
    where: {
      // @ts-ignore
      ...req?.query?.where,
      accountId: req.accountId,
    },
  };

  req.body = {
    ...req?.body,
    accountId: req.accountId,
  };

  return next();
}
