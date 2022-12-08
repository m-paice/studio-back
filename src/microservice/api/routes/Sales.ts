import { Router } from 'express';
import { accountContext } from '../../../middleware/accountContext';

import salesResource from '../../../resource/Sales';
import { promiseHandler } from '../../../utils/routing';

import controllerDefaut from '../controller';

const includeWhiteList = ['products', 'user', 'payment'];

const controller = controllerDefaut(salesResource, includeWhiteList);

const controllerCustom = {
  updateSaleById: promiseHandler(async (req) => {
    const response = await salesResource.updateSaleById(
      req.params.id,
      req.body
    );

    return response;
  }),
};

const router = Router();

router.use(accountContext);

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controllerCustom.updateSaleById);
router.delete('/:id', controller.destroy);

export default router;
