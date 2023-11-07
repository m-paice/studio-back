import { Request, Response, NextFunction } from 'express';

import resource from '../resource';

export const billing = async (req: Request, res: Response, next: NextFunction) => {
  const { method, ip, originalUrl, headers, userId, accountId = null } = req;

  const userAgent = headers['user-agent'];

  const billingInfo = {
    ipAddress: ip,
    method,
    originalUrl,
    userAgent,
    userId,
    accountId,
  };

  await resource.Billings.create(billingInfo);

  return next();
};
