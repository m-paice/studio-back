import { Op } from 'sequelize';
import { endOfDay, format, startOfDay } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { CampaignInstance } from '../models/Campaigns';
import CampaignSchedule from '../models/CampaignSchedule';
import CampaignUser from '../models/CampaignUser';
import CampaignsRepository from '../repository/Campaigns';
import BaseResource from './BaseResource';
import queuedAsyncMap from '../utils/queuedAsyncMap';
import UserResource from './Users';
import ScheduleResource from './Schedules';
import TemplatesResource from './Templates';
import { amqpClient } from '../services/amqp';
import { HttpError } from '../utils/error/HttpError';
import Schedule from '../models/Schedules';
import User from '../models/Users';
import { CAMPAIGN_DONE, CAMPAIGN_PENDING, CAMPAIGN_PROCECSSING } from '../constants/campaign';
import { handleReplaceAll } from './helpers/replaceAll';

interface Content {
  to: string;
  body: string;
}

export class CampaignsResource extends BaseResource<CampaignInstance> {
  constructor() {
    super({
      repository: CampaignsRepository,
      entity: 'Campaign',
      onCreated: async (props) => {
        const body = props.body as { users: string[]; scheduleAt: Date };
        const newRecord = props.new as CampaignInstance;

        if (body.users?.length) {
          await queuedAsyncMap(body.users, async (item) => {
            const user = await UserResource.findById(item);

            await newRecord.addUser(user, { through: { status: CAMPAIGN_PENDING } });
          });
        }

        if (body?.scheduleAt) {
          const startAt = startOfDay(new Date(body.scheduleAt)).toISOString();
          const endAt = endOfDay(new Date(body.scheduleAt)).toISOString();

          const schedules = await ScheduleResource.findMany({
            where: {
              accountId: newRecord.accountId,
              scheduleAt: {
                [Op.between]: [startAt, endAt],
              },
            },
          });

          await queuedAsyncMap(schedules, async (item) => {
            const schedule = await ScheduleResource.findById(item.id);

            await newRecord.addSchedule(schedule, { through: { status: CAMPAIGN_PENDING } });
          });
        }
      },
      onUpdated: async (props) => {
        const body = props.body as { users: string[]; scheduleAt: Date };
        const newRecord = props.new as CampaignInstance;

        /** ATUALIZANDO USUARIOS */
        if (body?.users && Array.isArray(body.users) && body.users.length) {
          // apagar todos os usuario dessa campanha
          await CampaignUser.destroy({ where: { campaignId: props.id } });

          // criar novos usuarios
          if (body.users?.length) {
            await queuedAsyncMap(body.users, async (item) => {
              const user = await UserResource.findById(item);

              await newRecord.addUser(user, { through: { status: CAMPAIGN_PENDING } });
            });
          }
        }

        /** ATUALIZANDO AGENDAMENTOS */
        if (body?.scheduleAt) {
          // apagar todos os agendamentos dessa campanha
          await CampaignSchedule.destroy({ where: { campaignId: props.id } });

          const startAt = startOfDay(new Date(body.scheduleAt)).toISOString();
          const endAt = endOfDay(new Date(body.scheduleAt)).toISOString();

          const schedules = await ScheduleResource.findMany({
            where: {
              accountId: newRecord.accountId,
              scheduleAt: {
                [Op.between]: [startAt, endAt],
              },
            },
          });

          await queuedAsyncMap(schedules, async (item) => {
            const schedule = await ScheduleResource.findById(item.id);

            await newRecord.addSchedule(schedule, { through: { status: CAMPAIGN_PENDING } });
          });
        }
      },
    });
  }

  // TODO: receber a conta para validar se é premium ou trial
  async start({ campaignId }: { campaignId: string }) {
    const campaign = await CampaignsRepository.findById(campaignId, {
      include: [
        'users',
        'template',
        {
          model: Schedule,
          as: 'schedules',
          include: [
            {
              model: User,
              as: 'user',
            },
          ],
        },
      ],
    });

    if (!campaign) throw new HttpError(500, 'campaign not found!');
    if (campaign.status === CAMPAIGN_DONE) throw new HttpError(500, 'campaign finished!');

    const payload: Content[] = [];

    let { content } = campaign;

    const template = campaign.templateId ? await TemplatesResource.findById(campaign.templateId) : null;

    if (campaign.users.length) {
      campaign.users.forEach((item) => {
        if (template) {
          content = handleReplaceAll({
            mensagem: template.content,
            contato: item.name,
            dia: null,
            diaDaSemana: null,
            horario: null,
          });
        }

        const sendPayload = {
          // userId: item.id,
          // campaignId,
          // content,
          // phoneNumber: item.cellPhone,

          to: `55${item.cellPhone}`,
          body: content,
        };

        payload.push(sendPayload);
      });
    }

    if (campaign.schedules.length) {
      campaign.schedules.forEach((item) => {
        if (template) {
          const selectDay = format(new Date(item.scheduleAt), 'dd/MMMM', { locale: ptBR });
          const dayOfWeek = format(new Date(item.scheduleAt), 'cccc', { locale: ptBR });
          const selectHour = format(new Date(item.scheduleAt), 'HH:mm');

          content = handleReplaceAll({
            mensagem: template.content,
            contato: item.user.name,
            dia: selectDay,
            diaDaSemana: dayOfWeek,
            horario: selectHour,
          });
        }

        const sendPayload = {
          // userId: item.user.id,
          // scheduleId: item.id,
          // campaignId,
          // content,
          // phoneNumber: item.user.cellPhone,

          to: `55${item.user.cellPhone}`,
          body: content,
        };

        payload.push(sendPayload);
      });
    }

    if (!payload.length) {
      await CampaignsRepository.updateById(campaignId, { status: CAMPAIGN_DONE });

      return true;
    }

    await Promise.all(payload.map(async (item) => amqpClient.publishQueue({ message: item })));
    await CampaignsRepository.updateById(campaignId, { status: CAMPAIGN_PROCECSSING });

    return true;
  }
}

export default new CampaignsResource();
