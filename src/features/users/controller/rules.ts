import { nanoid } from 'nanoid';
import type { ResponseAPI } from '../../types/api';
import { schemaValidateBodyForCreate, schemaValidateBodyForUpdate, schemaValidateParamsUUID } from './schemas';

export const validateBodyForCreate = (req, res, next) => {
  try {
    req.body = schemaValidateBodyForCreate.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      transaction: nanoid(),
      message: 'Invalid request body',
      args: error,
    } as ResponseAPI);
  }
};

export const validateBodyForUpdate = (req, res, next) => {
  try {
    req.body = schemaValidateBodyForUpdate.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      transaction: nanoid(),
      message: 'Invalid request body',
      args: error,
    } as ResponseAPI);
  }
};

export const validateParamsIsUUID = (req, res, next) => {
  try {
    req.params = schemaValidateParamsUUID.parse(req.params);
    next();
  } catch (error) {
    res.status(400).json({
      transaction: nanoid(),
      message: 'Invalid request params',
      args: error,
    } as ResponseAPI);
  }
};
