import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { VERIFY_TOKEN } from '../constants';

export const onlyAdmin = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  const token = authorization ? authorization.split(' ')[1] : null;

  if (!token) return res.sendStatus(401);

  const decoded: any = jwt.verify(token, VERIFY_TOKEN);

  if (!decoded) return res.sendStatus(401);

  if (decoded.accountId) return res.status(401).send('only admin');

  if (!decoded.isSuperAdmin) return res.status(401).send('only admin');

  return next();
};
