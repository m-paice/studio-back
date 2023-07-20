import { Router } from 'express';
import { accountContext } from '../../../middleware/accountContext';

import schedulesResource from '../../../resource/Schedules';
import { promiseHandler } from '../../../utils/routing';

import controllerDefaut from '../controller';

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
  updateById: promiseHandler(async (req) => {
    const payload = {
      ...req.body,
      addition: Number(req.body.addition),
      discount: Number(req.body.discount),
      accountId: req.accountId,
    };

    const response = await schedulesResource.updateScheduleById(
      req.params.id,
      payload
    );

    return response;
  }),
  revert: promiseHandler(async (req) => {
    const { id } = req.params;

    const response = await schedulesResource.revert({ scheduleId: id });

    return response;
  }),
};

const router = Router();

router.use(accountContext);

router.get('/', controller.many);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.delete('/:id', controller.destroy);

router.put('/:id', controllerCustom.updateById);
router.put('/:id/status', controllerCustom.changeStatus);
router.get('/:id/revert', controllerCustom.revert);

export default router;
