import { Router } from 'express';
import { nanoid } from 'nanoid';
import debug from 'debug';

import * as model from '../model';
import type { ResponseAPI } from '../../types/api';
import { validateBodyForCreate, validateParamsIsUUID } from './rules';

const logger = debug('features:controller:accounts:core');
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

router.get('/:id', validateParamsIsUUID, async (req, res) => {
  try {
    const account = await model.findAccountById({ id: req.params.id });

    if (!account) {
      res.status(404).json({
        transaction: nanoid(),
        message: 'Account not found',
        args: req.params.id,
      } as ResponseAPI<unknown, string>);
      return;
    }

    res.json({
      transaction: nanoid(),
      message: 'Account reader successfully',
      data: account,
    } as ResponseAPI<model.AccountInstance>);
  } catch (error) {
    logger('Error on reader account', error);
    res.status(400).json({
      transaction: nanoid(),
      message: 'Error on reader account',
      args: error,
    } as ResponseAPI);
  }
});

router.post('/', validateBodyForCreate, async (req, res) => {
  try {
    const account = await model.createAccount(req.body);

    res.json({
      transaction: nanoid(),
      message: 'Account created successfully',
      data: account,
    } as ResponseAPI<model.AccountInstance>);
  } catch (error) {
    logger('Error on create account', error);
    res.status(400).json({
      transaction: nanoid(),
      message: 'Error on create account',
      args: error,
    } as ResponseAPI);
  }
});

router.put('/:id', validateParamsIsUUID, async (req, res) => {
  try {
    const account = await model.updateAccountById({ id: req.params.id, data: req.body });

    if (!account) {
      res.status(404).json({
        transaction: nanoid(),
        message: 'Account not found',
        args: req.params.id,
      } as ResponseAPI<unknown, string>);
      return;
    }

    res.json({
      transaction: nanoid(),
      message: 'Account updated successfully',
      data: account,
    } as ResponseAPI<model.AccountInstance>);
  } catch (error) {
    logger('Error on update account', error);
    res.status(400).json({
      transaction: nanoid(),
      message: 'Error on update account',
      args: error,
    } as ResponseAPI);
  }
});

router.delete('/:id', validateParamsIsUUID, async (req, res) => {
  try {
    const account = await model.deleteAccountById({ id: req.params.id });

    if (account === 0) {
      res.status(404).json({
        transaction: nanoid(),
        message: 'Account not found',
        args: req.params.id,
      } as ResponseAPI<unknown, string>);
      return;
    }

    res.json({
      transaction: nanoid(),
      message: 'Account deleted successfully',
    } as ResponseAPI);
  } catch (error) {
    logger('Error on delete account', error);
    res.status(400).json({
      transaction: nanoid(),
      message: 'Error on delete account',
      args: error,
    } as ResponseAPI);
  }
});
export default router;
