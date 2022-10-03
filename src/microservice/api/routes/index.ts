import { Router } from 'express';

import usersRoutes from './Users';
import schedulesRoutes from './Schedules';
import servicesRoutes from './Services';
import reportsRoutes from './Reports';
import productsRoutes from './Products';
import categoryRoutes from './Categories';

import * as loggers from '../../../utils/logger';

const routes = Router();

routes.use(loggers.default.requestLogger);

routes.use('/users', usersRoutes);
routes.use('/services', servicesRoutes);
routes.use('/schedules', schedulesRoutes);
routes.use('/reports', reportsRoutes);
routes.use('/products', productsRoutes);
routes.use('/categories', categoryRoutes);

export default routes;
