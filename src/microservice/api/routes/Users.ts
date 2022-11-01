import { Router } from 'express';
import { accountContext } from '../../../middleware/accountContext';

import usersResource from '../../../resource/Users';
import { promiseHandler } from '../../../utils/routing';

import controllerDefaut from '../controller';

const includeWhiteList = ['account'];

const controller = controllerDefaut(usersResource, includeWhiteList);

const controllerCustom = {
  findByName: promiseHandler(async (req) => {
    const response = await usersResource.findUserByName(
      req.params.name,
      req.query
    );

    return response;
  }),
  findEmployeeByName: promiseHandler(async (req) => {
    const response = await usersResource.findUserEmployeeByName(
      req.params.name,
      req.query
    );

    return response;
  }),
};

const router = Router();

router.use(accountContext);

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/search/:name', controllerCustom.findByName);
router.get('/employee/:name', controllerCustom.findEmployeeByName);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);

export default router;
