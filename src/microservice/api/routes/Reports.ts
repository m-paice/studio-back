import { Router } from 'express';
import { accountContext } from '../../../middleware/accountContext';

import reportsResource from '../../../resource/Reports';
import { promiseHandler } from '../../../utils/routing';

import controllerDefaut from '../controller';

const controller = controllerDefaut(reportsResource);

const controllerCustom = {
  reports: promiseHandler(async (req) => {
    const { endAt, startAt } = req.body;

    if (req?.body?.type === 'sales') {
      const response = await reportsResource.saleReports(
        {
          startAt: new Date(startAt),
          endAt: new Date(endAt),
        },
        req.query
      );

      return response;
    }

    const response = await reportsResource.reports(
      {
        startAt: new Date(startAt),
        endAt: new Date(endAt),
      },
      req.query
    );

    return response;
  }),
};

const router = Router();

router.use(accountContext);

router.get('/', controller.index);
router.post('/', controllerCustom.reports);

export default router;
