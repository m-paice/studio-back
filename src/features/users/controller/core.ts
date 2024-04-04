import { Router } from 'express';
import { nanoid } from 'nanoid';
import debug from 'debug';
import { ResponseAPI } from '../../types/api';
import * as model from '../model';
import { validateBodyForCreate, validateParamsIsUUID } from './rules';

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

router.get('/:id', validateParamsIsUUID, async (req, res) => {
  try {
    const user = await model.findUserById({ id: req.params.id });

    if (!user) {
      res.status(404).json({
        transaction: nanoid(),
        message: 'User not found',
      } as ResponseAPI);
      return;
    }

    res.json({
      transaction: nanoid(),
      message: 'User reader successfully',
      data: user,
    } as ResponseAPI<model.UserInstance>);
  } catch (error) {
    logger('Error on reader user: %o', error);
    res.status(500).json({
      transaction: nanoid(),
      message: 'User reader error',
      args: error,
    } as ResponseAPI);
  }
});

router.post('/', validateBodyForCreate, async (req, res) => {
  try {
    const user = await model.createUser({ data: req.body });

    res.json({
      transaction: nanoid(),
      message: 'User created successfully',
      data: user,
    } as ResponseAPI<model.UserInstance>);
  } catch (error) {
    logger('Error on create user: %o', error);
    res.status(500).json({
      transaction: nanoid(),
      message: 'User create error',
      args: error,
    } as ResponseAPI);
  }
});

router.put('/:id', validateParamsIsUUID, async (req, res) => {
  try {
    const user = await model.updateUserById({ id: req.params.id, data: req.body });

    if (!user) {
      res.status(404).json({
        transaction: nanoid(),
        message: 'User not found',
      } as ResponseAPI);
      return;
    }

    res.json({
      transaction: nanoid(),
      message: 'User updated successfully',
      data: user,
    } as ResponseAPI<model.UserInstance>);
  } catch (error) {
    logger('Error on update user: %o', error);
    res.status(500).json({
      transaction: nanoid(),
      message: 'User update error',
      args: error,
    } as ResponseAPI);
  }
});

router.delete('/:id', validateParamsIsUUID, async (req, res) => {
  try {
    const user = await model.deleteUserById({ id: req.params.id });

    if (!user) {
      res.status(404).json({
        transaction: nanoid(),
        message: 'User not found',
      } as ResponseAPI);
      return;
    }

    res.json({
      transaction: nanoid(),
      message: 'User deleted successfully',
    } as ResponseAPI);
  } catch (error) {
    logger('Error on delete user: %o', error);
    res.status(500).json({
      transaction: nanoid(),
      message: 'User delete error',
      args: error,
    } as ResponseAPI);
  }
});

export default router;
