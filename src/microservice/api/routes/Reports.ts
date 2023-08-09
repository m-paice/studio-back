import { Router } from 'express';
import { accountContext } from '../../../middleware/accountContext';

import reportsResource from '../../../resource/Reports';
import { promiseHandler } from '../../../utils/routing';

import controllerDefaut from '../controller';
import Users from '../../../models/Users';
import Schedules from '../../../models/Schedules';
import Services from '../../../models/Services';

const controller = controllerDefaut(reportsResource, [
  {
    model: Schedules,
    as: 'schedule',
    include: [
      {
        model: Users,
        as: 'user',
        attributes: ['name'],
      },
      {
        model: Services,
        as: 'services',
        attributes: ['name'],
      },
    ],
  },
]);

const controllerCustom = {
  reports: promiseHandler(async (req) => {
    const { endAt, startAt } = req.body;

    if (req?.body?.type === 'sales') {
      const response = await reportsResource.saleReports(
        {
          startAt: new Date(startAt),
          endAt: new Date(endAt),
        },
        req.query,
      );

      return response;
    }

    const response = await reportsResource.reports(
      {
        startAt: new Date(startAt),
        endAt: new Date(endAt),
      },
      req.query,
    );

    return response;
  }),
  registerOut: promiseHandler(async (req) => {
    const payload = req.body;

    const response = await reportsResource.registerOut(payload);

    return response;
  }),
};

const router = Router();

router.use(accountContext);

router.get('/', controller.index);
router.post('/', controllerCustom.reports);
router.post('/register-out', controllerCustom.registerOut);
router.delete('/:id', controller.destroy);

export default router;
