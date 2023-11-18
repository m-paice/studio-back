import { Op } from 'sequelize';
import { endOfDay, format, startOfDay } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { CAMPAIGN_DONE, CAMPAIGN_PENDING, CAMPAIGN_PROCECSSING } from '../constants/campaign';
import { amqpClient } from '../services/amqp';
import queuedAsyncMap from '../utils/queuedAsyncMap';
import { HttpError } from '../utils/error/HttpError';
import { CampaignInstance } from '../models/Campaigns';
import CampaignSchedule from '../models/CampaignSchedule';
import Schedule from '../models/Schedules';
import User from '../models/Users';
import Account from '../models/Accounts';
import Services from '../models/Services';
import CampaignsRepository from '../repository/Campaigns';
import BaseResource from './BaseResource';
import ScheduleResource from './Schedules';
import TemplatesResource from './Templates';
import UserResource from './Users';

interface Message {
  template: string;
  data: {
    to: string;
    client: string;
    account: string;
    service: string;
    date: string;
    time: string;
    scheduleTime: string;
    link: string;
  };
}

export class CampaignsResource extends BaseResource<CampaignInstance> {
  constructor() {
    super({
      repository: CampaignsRepository,
      entity: 'Campaign',
      onCreated: async (props) => {
        const body = props.body as { users: string[]; scheduleAt: Date };
        const newRecord = props.new as CampaignInstance;

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
        'template',
        {
          model: Schedule,
          as: 'schedules',
          include: [
            {
              model: User,
              as: 'user',
            },
            {
              model: Account,
              as: 'account',
            },
            {
              model: Services,
              as: 'services',
            },
          ],
        },
      ],
    });

    if (!campaign) throw new HttpError(500, 'campaign not found!');
    if (campaign.status === CAMPAIGN_DONE) throw new HttpError(500, 'campaign finished!');

    const template = await TemplatesResource.findById(campaign.templateId);
    if (!template) throw new HttpError(500, 'template is required');

    const userAdmin = await UserResource.findOne({
      where: {
        accountId: campaign.accountId,
        isSuperAdmin: true,
      },
    });

    const payload: Message[] = [];

    if (campaign.schedules.length) {
      campaign.schedules.forEach((item) => {
        const selectDay = format(new Date(item.scheduleAt), 'dd/MMMM', { locale: ptBR });
        const dayOfWeek = format(new Date(item.scheduleAt), 'cccc', { locale: ptBR });
        const selectHour = format(new Date(item.scheduleAt), 'HH:mm');

        payload.push({
          template: template.name,
          data: {
            to: `+55${item.user.cellPhone}`,
            client: item.user.name,
            account: item.account.name,
            service: item.services.map((service) => service.name).join(' + '),
            date: `${selectDay} (${dayOfWeek})`,
            time: selectHour,
            scheduleTime: campaign.timeBeforeSchedule.toString(),
            link: `https://wa.me/55${userAdmin.cellPhone}`,
          },
        });
      });
    }

    if (!payload.length) {
      await CampaignsRepository.updateById(campaignId, { status: CAMPAIGN_DONE });

      return true;
    }

    await Promise.all(
      payload.map(async (item) => amqpClient.publishInExchangeByRoutingKey({ routingKey: 'message', message: item })),
    );
    await CampaignsRepository.updateById(campaignId, { status: CAMPAIGN_PROCECSSING });

    return true;
  }
}

export default new CampaignsResource();
