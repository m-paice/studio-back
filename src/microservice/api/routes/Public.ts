import { Router } from 'express';

import { promiseHandler } from '../../../utils/routing';
import { billing } from '../../../middleware/billing';
import resource from '../../../resource';

const controllerCustom = {
  info: promiseHandler(async (req) => {
    const accountId = req.params.id;

    const account = await resource.Accounts.findById(accountId);

    return account;
  }),
  services: promiseHandler(async (req) => {
    const accountId = req.params.id;

    const services = await resource.Services.findMany({
      where: {
        accountId,
      },
    });

    return services;
  }),
  schedules: promiseHandler(async (req) => {
    const accountId = req.params.id;

    const schedules = await resource.Schedules.findMany({
      where: {
        accountId,
        ...req.query.where,
      },
    });

    return schedules;
  }),
  createSchedule: promiseHandler(async (req) => {
    const accountId = req.params.id;
    const payload = req.body;

    const userAdmin = await resource.Users.findOne({
      where: {
        accountId,
        isSuperAdmin: true,
      },
    });

    const response = await resource.Schedules.create({
      ...payload,
      accountId,
      employeeId: userAdmin.id,
    });

    return response;
  }),
};

const router = Router();

router.use(billing);

router.get('/account/:id/info', controllerCustom.info);
router.get('/account/:id/services', controllerCustom.services);
router.get('/account/:id/schedules', controllerCustom.schedules);
router.post('/account/:id/schedules', controllerCustom.createSchedule);

export default router;
