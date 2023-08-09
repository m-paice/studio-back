import { ServerResponse } from 'http';
import debug from 'debug';
import { Request, Response, NextFunction } from 'express';

type HandlerFunction = (req: Request, res: Response, next?: NextFunction) => Promise<any> | ServerResponse | any;

const logger = debug('@promiseHandler');

export const promiseHandler = (fn: HandlerFunction) => (req: Request, res: Response, next: NextFunction) => {
  const resultOrPromise = fn(req, res, next);

  // >2 args is a middleware with next
  if (fn.length > 2) return;

  // return res.something()
  if (resultOrPromise instanceof ServerResponse) {
    return;
  }

  // return Promise
  if (resultOrPromise && resultOrPromise.then) {
    resultOrPromise
      .then((result: any) => {
        if (result === true) {
          res.sendStatus(200);
          return;
        }
        res.json(result);
      })
      .catch((error) => {
        logger('error on promise handler', { error });

        next(error);
      });

    return;
  }

  logger('Something else then Promise or ServerResponse returned from controller method.', resultOrPromise);
  res.send(resultOrPromise);
};
