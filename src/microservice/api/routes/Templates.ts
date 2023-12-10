import { Router } from 'express';

import resource from '../../../resource';
import controllerDefaut from '../controller';
import { accountContext } from '../../../middleware/accountContext';

const whiteList = [];

const controller = controllerDefaut(resource.Templates, whiteList);

const router = Router();

router.use(accountContext);
// router.use(billing);

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);

export default router;
