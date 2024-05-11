import { Router } from 'express';
import { nanoid } from 'nanoid';
import debug from 'debug';
import { ResponseAPI } from '../../types/api';
import * as model from '../model';
import { validateBodyForCreate, validateBodyForUpdate, validateParamsIsUUID } from './rules';

const logger = debug('features:services:controller:core');
const router = Router();

router.get('/', async (req, res) => {
  try {
    const services = await model.findServices({});

    res.json({
      transaction: nanoid(),
      message: 'Services reader successfully',
      data: services,
    } as ResponseAPI<model.ServiceInstance[]>);
  } catch (error) {
    logger('Error on reader services: %o', error);
    res.status(500).json({
      transaction: nanoid(),
      message: 'Services reader error',
      args: error,
    } as ResponseAPI);
  }
});

router.get('/:id', validateParamsIsUUID, async (req, res) => {
  try {
    const service = await model.findServiceById({ id: req.params.id });

    if (!service) {
      res.status(404).json({
        transaction: nanoid(),
        message: 'Service not found',
      } as ResponseAPI);
      return;
    }

    res.json({
      transaction: nanoid(),
      message: 'Service reader successfully',
      data: service,
    } as ResponseAPI<model.ServiceInstance>);
  } catch (error) {
    logger('Error on reader service: %o', error);
    res.status(500).json({
      transaction: nanoid(),
      message: 'Service reader error',
      args: error,
    } as ResponseAPI);
  }
});

router.post('/', validateBodyForCreate, async (req, res) => {
  try {
    const service = await model.createService({ data: req.body });

    res.json({
      transaction: nanoid(),
      message: 'Service created successfully',
      data: service,
    } as ResponseAPI<model.ServiceInstance>);
  } catch (error) {
    logger('Error on create service: %o', error);
    res.status(500).json({
      transaction: nanoid(),
      message: 'Service create error',
      args: error,
    } as ResponseAPI);
  }
});

router.put('/:id', validateParamsIsUUID, validateBodyForUpdate, async (req, res) => {
  try {
    const service = await model.updateServiceById({ id: req.params.id, data: req.body });

    if (!service) {
      res.status(404).json({
        transaction: nanoid(),
        message: 'Service not found',
      } as ResponseAPI);
      return;
    }

    res.json({
      transaction: nanoid(),
      message: 'Service updated successfully',
      data: service,
    } as ResponseAPI<model.ServiceInstance>);
  } catch (error) {
    logger('Error on update service: %o', error);
    res.status(500).json({
      transaction: nanoid(),
      message: 'Service update error',
      args: error,
    } as ResponseAPI);
  }
});

router.delete('/:id', validateParamsIsUUID, async (req, res) => {
  try {
    const service = await model.deleteServiceById({ id: req.params.id });

    if (!service) {
      res.status(404).json({
        transaction: nanoid(),
        message: 'Service not found',
      } as ResponseAPI);
      return;
    }

    res.json({
      transaction: nanoid(),
      message: 'Service deleted successfully',
    } as ResponseAPI);
  } catch (error) {
    logger('Error on delete service: %o', error);
    res.status(500).json({
      transaction: nanoid(),
      message: 'Service delete error',
      args: error,
    } as ResponseAPI);
  }
});

export default router;
