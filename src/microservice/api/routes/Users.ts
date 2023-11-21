import { Router } from 'express';

import usersResource from '../../../resource/Users';
import { promiseHandler } from '../../../utils/routing';
import controllerDefaut from '../controller';
import { accountContext } from '../../../middleware/accountContext';
import { billing } from '../../../middleware/billing';

const includeWhiteList = ['account'];

const controller = controllerDefaut(usersResource, includeWhiteList);

const controllerCustom = {
  findByName: promiseHandler(async (req) => {
    const response = await usersResource.findUserByName(req.params.name, req.query);

    return response;
  }),
  findEmployeeByName: promiseHandler(async (req) => {
    const response = await usersResource.findUserEmployeeByName(req.params.name, req.query);

    return response;
  }),
  import: promiseHandler(async (req) => {
    const response = await usersResource.import({ payload: req.body.users, accountId: req.accountId });

    return response;
  }),
};

const router = Router();

router.use(accountContext);
router.use(billing);

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/search/:name', controllerCustom.findByName);
router.get('/employee/:name', controllerCustom.findEmployeeByName);
router.post('/', controller.create);
router.post('/import', controllerCustom.import);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);

export default router;
