import { Router } from 'express';
import { nanoid } from 'nanoid';
import debug from 'debug';
import { ResponseAPI } from '../../types/api';
import * as model from '../model';

const logger = debug('features:users:controller:core');
const router = Router();

router.get('/', async (req, res) => {
  try {
    const users = await model.findUsers({});

    res.json({
      transaction: nanoid(),
      message: 'Users reader successfully',
      data: users,
    } as ResponseAPI<model.UserInstance[]>);
  } catch (error) {
    logger('Error on reader users: %o', error);
    res.status(500).json({
      transaction: nanoid(),
      message: 'Users reader error',
      args: error,
    } as ResponseAPI);
  }
});

export default router;
