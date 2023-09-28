import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { VERIFY_TOKEN } from '../constants';
import AccountsResource from '../resource/Accounts';

const auth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  const token = authorization ? authorization.split(' ')[1] : null;

  if (!token) return res.sendStatus(401);

  const decoded: any = jwt.verify(token, VERIFY_TOKEN);

  if (!decoded) return res.sendStatus(401);

  if (!decoded.accountId && decoded.isSuperAdmin) return next();

  // check account valid
  AccountsResource.findById(decoded.accountId).then((response) => {
    if (!response?.enable) return res.status(401).json({ message: 'account blocked' });

    req.userId = decoded.userId;
    req.accountId = decoded.accountId;
    req.isSuperAdmin = decoded.isSuperAdmin;

    return next();
  });
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
