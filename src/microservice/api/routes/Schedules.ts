import { Router } from 'express';

import schedulesResource from '../../../resource/Schedules';
import { promiseHandler } from '../../../utils/routing';
import controllerDefaut from '../controller';
import { validatePayload } from '../../../middleware/validatePayload';
import { accountContext } from '../../../middleware/accountContext';
import { billing } from '../../../middleware/billing';

const whiteList = ['user', 'services', 'employee'];

const controller = controllerDefaut(schedulesResource, whiteList);

const controllerCustom = {
  changeStatus: promiseHandler(async (req) => {
    const { status } = req.body;
    const { accountId } = req;

    const response = await schedulesResource.changeStatus({
      id: req.params.id,
      status,
      accountId,
    });

    return response;
  }),

  revert: promiseHandler(async (req) => {
    const { id } = req.params;

    const response = await schedulesResource.revert({ scheduleId: id });

    return response;
  }),

  confirmed: promiseHandler(async (req) => {
    const { id } = req.params;

    const response = schedulesResource.confirmed({ scheduleId: id });

    return response;
  }),

  canceled: promiseHandler(async (req) => {
    const { id } = req.params;

    const response = schedulesResource.canceled({ scheduleId: id });

    return response;
  }),
};

const router = Router();

router.use(accountContext);
router.use(billing);

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', validatePayload, controller.create);
router.put('/:id', validatePayload, controller.update);
router.delete('/:id', controller.destroy);

router.put('/:id/status', controllerCustom.changeStatus);
router.get('/:id/revert', controllerCustom.revert);
router.get('/:id/confirmed', controllerCustom.confirmed);
router.get('/:id/canceled', controllerCustom.canceled);

export default router;
