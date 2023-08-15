import { Request, Response, NextFunction } from 'express';

export function validatePayload(req: Request, res: Response, next: NextFunction) {
  req.body.addition = req.body.addition ? parseInt(req.body.addition, 10) : 0;
  req.body.discount = req.body.discount ? parseInt(req.body.discount, 10) : 0;

  return next();
}
