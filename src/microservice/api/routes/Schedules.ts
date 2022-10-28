import { Router } from 'express';

import schedulesResource from '../../../resource/Schedules';
import { promiseHandler } from '../../../utils/routing';

import controllerDefaut from '../controller';

const whiteList = ['user', 'service', 'employee'];

const controller = controllerDefaut(schedulesResource, whiteList);

const controllerCustom = {
  changeStatus: promiseHandler(async (req) => {
    const { status } = req.body;

    const response = await schedulesResource.changeStatus({
      id: req.params.id,
      status,
    });

    return response;
  }),
  updateById: promiseHandler(async (req) => {
    const payload = {
      ...req.body,
      addition: Number(req.body.addition),
      discount: Number(req.body.discount),
    };

    const response = await schedulesResource.updateScheduleById(
      req.params.id,
      payload
    );

    return response;
  }),
};

const router = Router();

router.get('/', controller.many);
router.get('/:id', controller.show);
router.post('/', controller.create);

router.put('/:id', controllerCustom.updateById);
router.put('/:id/status', controllerCustom.changeStatus);
router.delete('/:id', controller.destroy);

export default router;
