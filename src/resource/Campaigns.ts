import { Op } from 'sequelize';
import { endOfDay, startOfDay } from 'date-fns';

import { CAMPAIGN_PENDING, CAMPAIGN_PROCECSSING } from '../constants/campaign';

import queuedAsyncMap from '../utils/queuedAsyncMap';
import { CampaignInstance } from '../models/Campaigns';
import CampaignSchedule from '../models/CampaignSchedule';

import CampaignsRepository from '../repository/Campaigns';
import BaseResource from './BaseResource';
import ScheduleResource from './Schedules';

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
    await CampaignsRepository.updateById(campaignId, { status: CAMPAIGN_PROCECSSING });

    return true;
  }
}

export default new CampaignsResource();
