import { Router } from 'express';

import usersResource from '../../../resource/Users';
import { promiseHandler } from '../../../utils/routing';

import controllerDefaut from '../controller';

const controller = controllerDefaut(usersResource);

const controllerCustom = {
  findByName: promiseHandler(async (req) => {
    const response = await usersResource.findUserByName(req.params.name);

    return response;
  }),
  findEmployeeByName: promiseHandler(async (req) => {
    const response = await usersResource.findUserEmployeeByName(
      req.params.name
    );

    return response;
  }),
};

const router = Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/search/:name', controllerCustom.findByName);
router.get('/employee/:name', controllerCustom.findEmployeeByName);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);

export default router;
