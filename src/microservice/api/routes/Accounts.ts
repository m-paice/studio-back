import { Router } from 'express';

import accountsResource from '../../../resource/Accounts';
import { promiseHandler } from '../../../utils/routing';

import controllerDefaut from '../controller';

const controller = controllerDefaut(accountsResource);

const controllerCustom = {
  findByName: promiseHandler(async (req) => {
    const response = await accountsResource.findAccountByName(
      req.params.name,
      req.query
    );

    return response;
  }),
};

const router = Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/search/:name', controllerCustom.findByName);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);

export default router;
