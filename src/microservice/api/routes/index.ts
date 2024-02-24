import { Router } from 'express';

import authRoutes from './Auth';
import accountsRoutes from './Accounts';
import usersRoutes from './Users';
import schedulesRoutes from './Schedules';
import servicesRoutes from './Services';
import reportsRoutes from './Reports';
import adminRoutes from './Admin';
import publicRoutes from './Public';
import templateRoutes from './Templates';
import campaignsRoutes from './Campaigns';
import billignsRoutes from './Billigns';
import notificationsRoutes from './Notifications';

import * as loggers from '../../../utils/logger';
import auth from '../../../middleware/auth';
import { onlyAdmin } from '../../../middleware/onlyAdmin';

const routes = Router();

routes.use(loggers.default.requestLogger);

routes.use('/auth', authRoutes);
routes.use('/users', auth, usersRoutes);
routes.use('/services', auth, servicesRoutes);
routes.use('/schedules', auth, schedulesRoutes);
routes.use('/reports', auth, reportsRoutes);
routes.use('/templates', auth, templateRoutes);
routes.use('/billigns', auth, billignsRoutes);
routes.use('/campaigns', auth, campaignsRoutes);
routes.use('/notifications', auth, notificationsRoutes);
routes.use('/accounts', onlyAdmin, accountsRoutes);
routes.use('/admin', onlyAdmin, adminRoutes);
routes.use('/public', publicRoutes);

export default routes;
