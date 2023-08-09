import { Router } from 'express';
import { accountContext } from '../../../middleware/accountContext';

import servicesResource from '../../../resource/Services';
import { promiseHandler } from '../../../utils/routing';

import controllerDefaut from '../controller';

const whiteList = ['products'];

const controller = controllerDefaut(servicesResource, whiteList);

const controllerCustom = {
  findByName: promiseHandler(async (req) => {
    const response = await servicesResource.findServiceByName(
      req.params.name,
      req.query,
    );

    return response;
  }),
};

const router = Router();

const handleFormatData = (req, res, next) => {
  req.body.price = Number(req.body.price);
  req.body.porcent = Number(req.body.porcent);

  return next();
};

router.use(accountContext);

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/search/:name', controllerCustom.findByName);
router.post('/', handleFormatData, controller.create);
router.put('/:id', handleFormatData, controller.update);
router.delete('/:id', controller.destroy);

export default router;
