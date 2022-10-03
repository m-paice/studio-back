import { Router } from 'express';

import reportsResource from '../../../resource/Reports';
import { promiseHandler } from '../../../utils/routing';

import controllerDefaut from '../controller';

const controller = controllerDefaut(reportsResource);

const controllerCustom = {
  reports: promiseHandler(async (req) => {
    const { endAt, startAt } = req.body;

    const response = await reportsResource.reports({
      startAt,
      endAt,
    });

    return response;
  }),
};

const router = Router();

router.get('/', controller.index);
router.post('/', controllerCustom.reports);

export default router;
