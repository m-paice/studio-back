import { Router } from 'express';
import { format, getDay, isAfter, subHours, subMinutes } from 'date-fns';

import { days } from '../../../constants/days';
import { sendNotification } from '../../../services/expo';
import { promiseHandler } from '../../../utils/routing';
import queuedAsyncMap from '../../../utils/queuedAsyncMap';
import ScheduleResource from '../../../resource/Schedules';
import resource from '../../../resource';
import User from '../../../models/Users';
import Service from '../../../models/Services';

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

    const schedules = await ScheduleResource.findMany({
      where: {
        accountId,
        ...req.query.where,
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'cellPhone'],
        },
      ],
    });

    const response = schedules.map((item) => {
      // eslint-disable-next-line
      if (req.query?.me !== item.user.cellPhone) item.user.cellPhone = '***';

      return item;
    });

    return response;
  }),
  createSchedule: promiseHandler(async (req) => {
    const accountId = req.params.id;
    const payload = req.body;

    // find schedule scheduleAt between 5 minutes before and 5 minutes after
    const scheduleAlreadyExists = await ScheduleResource.findOne({
      where: {
        accountId,
        scheduleAt: {
          $between: [subMinutes(new Date(payload.scheduleAt), 5), subMinutes(new Date(payload.scheduleAt), -5)],
        },
        status: 'pending',
      },
    });

    if (scheduleAlreadyExists) throw new Error('Já existe um agendamento para este horário.');

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

    const userAdmin = await resource.Users.findOne({
      where: {
        accountId,
        isSuperAdmin: true,
      },
    });

    const response = await ScheduleResource.create({
      ...payload,
      accountId,
      employeeId: userAdmin.id,
      userId: user.id,
    });

    const account = await resource.Accounts.findById(accountId);

    if (response && account.token && Array.isArray(JSON.parse(account.token as unknown as string))) {
      await queuedAsyncMap(JSON.parse(account.token as unknown as string), async (token) => {
        const schedule = await ScheduleResource.findById(response.id, {
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['name'],
            },
            {
              model: Service,
              as: 'services',
              attributes: ['name'],
            },
          ],
        });

        const serviceNames = schedule.services.map((service) => service.name).join(', ');
        const clientName = schedule?.user?.name || schedule.shortName;

        const date = format(new Date(response.scheduleAt), 'dd/MM');
        const dayWeek = getDay(new Date(response.scheduleAt));
        const time = format(subHours(new Date(response.scheduleAt), 3), 'HH:mm');

        await sendNotification({
          token,
          title: 'Novo agendamento',
          message: `O cliente ${clientName} realizou recentemente uma reserva por meio do seu link. 
          O agendamento está programado para o dia ${date} (${days[dayWeek]}) às ${time}. 
          Os serviços solicitados incluem: ${serviceNames}.`,
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

  confirm: promiseHandler(async (req, res) => {
    const id = req.params.id.replace('{{1}}', '');

    const schedule = await ScheduleResource.findById(id, { include: ['account'] });

    if (schedule) {
      if (
        schedule &&
        schedule.account.token &&
        Array.isArray(JSON.parse(schedule.account.token as unknown as string))
      ) {
        await queuedAsyncMap(JSON.parse(schedule.account.token as unknown as string), async (token) => {
          const scheduleFull = await ScheduleResource.findById(id, {
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['name'],
              },
            ],
          });

          const clientName = scheduleFull?.user?.name || scheduleFull.shortName;

          const date = format(new Date(scheduleFull.scheduleAt), 'dd/MM');
          const dayWeek = getDay(new Date(scheduleFull.scheduleAt));
          const time = format(subHours(new Date(scheduleFull.scheduleAt), 3), 'HH:mm');

          await sendNotification({
            token,
            title: 'Agendamento confirmado',
            message: `O cliente ${clientName} confirmou o agendamento. Marcado para o dia ${date} (${days[dayWeek]}) às ${time}.`,
          });
        });
      }
    }

    res.redirect('https://meupetrecho.com.br/confirmacao');
  }),

  cancel: promiseHandler(async (req) => {
    const { id } = req.params;

    const schedule = await ScheduleResource.findById(id, { include: ['account'] });

    if (isAfter(new Date(), subHours(new Date(schedule.scheduleAt), 1))) {
      throw new Error(
        `Não é possível cancelar o agendamento. Faltando menos de 1 hora para o horário marcado. ${schedule.scheduleAt}`,
      );
    }

    if (schedule) {
      await ScheduleResource.updateById(id, { status: 'canceled' });

      if (
        schedule &&
        schedule.account.token &&
        Array.isArray(JSON.parse(schedule.account.token as unknown as string))
      ) {
        await queuedAsyncMap(JSON.parse(schedule.account.token as unknown as string), async (token) => {
          const scheduleFull = await ScheduleResource.findById(id, {
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['name'],
              },
            ],
          });

          const clientName = scheduleFull?.user?.name || scheduleFull.shortName;

          const date = format(new Date(scheduleFull.scheduleAt), 'dd/MM');
          const dayWeek = getDay(new Date(scheduleFull.scheduleAt));
          const time = format(subHours(new Date(scheduleFull.scheduleAt), 3), 'HH:mm');

          await sendNotification({
            token,
            title: 'Agendamento cancelado',
            message: `O cliente ${clientName} cancelou o agendamento. Marcado para o dia ${date} (${days[dayWeek]}) às ${time}.`,
          });
        });
      }
    }

    return true;
  }),

  infoSchedule: promiseHandler(async (req) => {
    const { id } = req.params;

    const schedule = await ScheduleResource.findById(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'cellPhone'],
        },
        {
          model: Service,
          as: 'services',
          attributes: ['id', 'name', 'price'],
        },
      ],
    });

    return schedule;
  }),
};

const router = Router();

// router.use(billing);

router.get('/account/:id/info', controllerCustom.info);
router.get('/account/:id/services', controllerCustom.services);
router.get('/account/:id/schedules', controllerCustom.schedules);
router.post('/account/:id/schedules', controllerCustom.createSchedule);
router.post('/account/trial', controllerCustom.createAccountAndUser);
router.put('/account/:id/config', controllerCustom.updateAccountConfig);
router.put('/account/:id/token', controllerCustom.updateAccountToken);
router.get('/schedule/confirm/:id', controllerCustom.confirm);
router.delete('/schedule/cancel/:id', controllerCustom.cancel);
router.get('/schedule/details/:id', controllerCustom.infoSchedule);

export default router;
