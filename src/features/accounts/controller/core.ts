import { Router } from 'express';
import { nanoid } from 'nanoid';
import debug from 'debug';

import * as model from '../model';
import type { ResponseAPI } from '../../types/api';

const logger = debug('features:accounts:core');
const router = Router();

router.get('/', async (req, res) => {
  try {
    const accounts = await model.findAccount({});

    res.json({
      transaction: nanoid(),
      message: 'Accounts reader successfully',
      data: accounts,
    } as ResponseAPI<model.AccountInstance[]>);
  } catch (error) {
    logger('Error on reader accounts', error);
    res.status(400).json({
      transaction: nanoid(),
      message: 'Error on reader accounts',
      args: error,
    } as ResponseAPI);
  }
});

export default router;
