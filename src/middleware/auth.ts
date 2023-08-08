import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { VERIFY_TOKEN } from '../constants';

const auth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  const token = authorization ? authorization.split(' ')[1] : null;

  if (!token) return res.sendStatus(401);

  const decoded: any = jwt.verify(token, VERIFY_TOKEN);

  if (!decoded) return res.sendStatus(401);

  req.userId = decoded.userId;
  req.accountId = decoded.accountId;
  req.isSuperAdmin = decoded.isSuperAdmin;

  return next();
};

export const generateToken = ({
  userId,
  accountId,
  isSuperAdmin,
}: {
  userId: string;
  accountId: string;
  isSuperAdmin: boolean;
}) => jwt.sign({ userId, accountId, isSuperAdmin }, VERIFY_TOKEN);

export default auth;
