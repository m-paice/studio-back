import { Router } from 'express';

import authRoutes from './Auth';
import accountsRoutes from './Accounts';
import usersRoutes from './Users';
import schedulesRoutes from './Schedules';
import servicesRoutes from './Services';
import reportsRoutes from './Reports';

import * as loggers from '../../../utils/logger';
import auth from '../../../middleware/auth';

const routes = Router();

routes.use(loggers.default.requestLogger);

routes.use('/auth', authRoutes);
routes.use('/accounts', accountsRoutes);
routes.use('/users', auth, usersRoutes);
routes.use('/services', auth, servicesRoutes);
routes.use('/schedules', auth, schedulesRoutes);
routes.use('/reports', auth, reportsRoutes);

export default routes;
