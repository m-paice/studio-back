import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface IRequest extends Request {
  userId: string;
}

const auth = (req: IRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  const token = authorization ? authorization.split(' ')[1] : null;

  if (!token) return res.sendStatus(401);

  const decoded: any = jwt.verify(token, process.env.VERIFY_TOKEN);

  if (!decoded) return res.sendStatus(401);

  req.userId = decoded.id;

  return next();
};

export default auth;
