import { Router } from 'express';

import { format, getDay } from 'date-fns';
import { promiseHandler } from '../../../utils/routing';
import { billing } from '../../../middleware/billing';
import resource from '../../../resource';
import { sendNotification } from '../../../services/expo';
import queuedAsyncMap from '../../../utils/queuedAsyncMap';
import { days } from '../../../constants/days';
import User from '../../../models/Users';

const controllerCustom = {
  info: promiseHandler(async (req) => {
    const accountId = req.params.id;

    const account = await resource.Accounts.findById(accountId);

    return account;
  }),
  services: promiseHandler(async (req) => {
    const accountId = req.params.id;

    const services = await resource.Services.findMany({
      where: {
        accountId,
      },
    });

    return services;
  }),
  schedules: promiseHandler(async (req) => {
    const accountId = req.params.id;

    const schedules = await resource.Schedules.findMany({
      where: {
        accountId,
        ...req.query.where,
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    return schedules;
  }),
  createSchedule: promiseHandler(async (req) => {
    const accountId = req.params.id;
    const payload = req.body;

    console.log(JSON.stringify(payload, null, 2));

    let user = await resource.Users.findOne({
      where: {
        accountId,
        cellPhone: payload.cellPhone,
      },
    });

    if (!user) {
      user = await resource.Users.create({
        name: payload.shortName,
        cellPhone: payload.cellPhone,
        type: 'pf',
        accountId,
      });
    }

    console.log(user);

    const userAdmin = await resource.Users.findOne({
      where: {
        accountId,
        isSuperAdmin: true,
      },
    });

    const response = await resource.Schedules.create({
      ...payload,
      accountId,
      employeeId: userAdmin.id,
      user: user.id,
    });

    const account = await resource.Accounts.findById(accountId);

    if (response && account.token && Array.isArray(JSON.parse(account.token as unknown as string))) {
      await queuedAsyncMap(JSON.parse(account.token as unknown as string), async (token) => {
        const date = format(new Date(response.scheduleAt), 'dd/MM');
        const dayWeek = getDay(new Date(response.scheduleAt));
        const time = format(new Date(response.scheduleAt), 'HH:mm');

        await sendNotification({
          token,
          title: 'Novo agendamento',
          message: `O cliente ${response.shortName} acabou de criar um agendamento utilizando o seu link. Para o dia ${date} (${days[dayWeek]}) ás ${time}`,
        });
      });
    }

    return response;
  }),
  createAccountAndUser: promiseHandler(async (req) => {
    const { name, cellPhone, password } = req.body;

    const account = await resource.Accounts.createTrial({ name });
    const user = await resource.Users.create({
      name,
      cellPhone,
      password,
      type: 'pj',
      isSuperAdmin: true,
      accountId: account.id,
    });
    const authenticate = await resource.Auth.authLogin({ username: user.cellPhone, password });
    return authenticate;
  }),
  updateAccountConfig: promiseHandler(async (req) => {
    const accountId = req.params.id;
    const payload = req.body;

    const account = await resource.Accounts.findById(accountId);
    if (!account) throw new Error('account not found');

    return resource.Accounts.updateById(accountId, {
      name: payload.name,
      config: payload.config,
    });
  }),
  updateAccountToken: promiseHandler(async (req) => {
    const accountId = req.params.id;
    const payload = req.body;

    const account = await resource.Accounts.findById(accountId);
    if (!account) throw new Error('account not found');

    let tokens = account.token;

    if (payload.token) {
      // verificar se ja existe outros token na conta
      if (Array.isArray(tokens)) {
        // verificar se o mesmo token ja existe na conta
        if (!tokens.includes(payload.token)) {
          tokens = [...tokens, payload.token];
        }
      } else {
        tokens = [payload.token];
      }
    }

    return resource.Accounts.updateById(accountId, {
      token: tokens,
    });
  }),
};

const router = Router();

router.use(billing);

router.get('/account/:id/info', controllerCustom.info);
router.get('/account/:id/services', controllerCustom.services);
router.get('/account/:id/schedules', controllerCustom.schedules);
router.post('/account/:id/schedules', controllerCustom.createSchedule);
router.post('/account/trial', controllerCustom.createAccountAndUser);
router.put('/account/:id/config', controllerCustom.updateAccountConfig);
router.put('/account/:id/token', controllerCustom.updateAccountToken);

export default router;
