import { Router } from 'express';
import { accountContext } from '../../../middleware/accountContext';

import productResource from '../../../resource/Products';
import { promiseHandler } from '../../../utils/routing';

import controllerDefaut from '../controller';

const whiteList = ['category'];

const controller = controllerDefaut(productResource, whiteList);

const controllerCustom = {
  findByName: promiseHandler(async (req) => {
    const response = await productResource.findProductByName(
      req.params.name,
      req.query,
    );

    return response;
  }),
};

const router = Router();

router.use(accountContext);

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/search/:name', controllerCustom.findByName);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);

export default router;
