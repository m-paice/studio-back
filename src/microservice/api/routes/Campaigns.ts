import { Router } from 'express';

import resource from '../../../resource';
import controllerDefaut from '../controller';
import { billing } from '../../../middleware/billing';
import { enableAccount } from '../../../middleware/enableAccount';
import { accountContext } from '../../../middleware/accountContext';
import { promiseHandler } from '../../../utils/routing';
import Schedule from '../../../models/Schedules';

const whiteList = [
  {
    model: Schedule,
    as: 'schedules',
  },
  'template',
];

const controller = controllerDefaut(resource.Campaigns, whiteList);

const controllerCustom = {
  start: promiseHandler(async (req) => {
    const { id } = req.params;

    const response = await resource.Campaigns.start({ campaignId: id });
    return response;
  }),
};

const router = Router();

router.use(accountContext);
router.use(enableAccount);
router.use(billing);

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);

router.post('/:id/start', controllerCustom.start);

export default router;
