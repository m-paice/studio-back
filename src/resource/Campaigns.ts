import { Op } from 'sequelize';
import { endOfDay, startOfDay } from 'date-fns';

import { CAMPAIGN_DONE, CAMPAIGN_PENDING, CAMPAIGN_PROCECSSING } from '../constants/campaign';

import queuedAsyncMap from '../utils/queuedAsyncMap';
import { CampaignInstance } from '../models/Campaigns';
import CampaignSchedule from '../models/CampaignSchedule';

import CampaignsRepository from '../repository/Campaigns';
import BaseResource from './BaseResource';
import resource from '.';
import { HttpError } from '../utils/error/HttpError';
import { sendMessageDiscord } from '../services/discord';

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

          const schedules = await resource.Schedules.findMany({
            where: {
              accountId: newRecord.accountId,
              scheduleAt: {
                [Op.between]: [startAt, endAt],
              },
            },
          });

          await queuedAsyncMap(schedules, async (item) => {
            const schedule = await resource.Schedules.findById(item.id);

            await newRecord.addSchedule(schedule, { through: { status: CAMPAIGN_PENDING } });
          });
        }
      },
      onUpdated: async (props) => {
        const body = props.body as { users: string[]; scheduleAt: Date };
        const newRecord = props.new as CampaignInstance;

        /** ATUALIZANDO AGENDAMENTOS */
        if (body?.scheduleAt) {
          // apagar todos os agendamentos dessa campanha que ja foram concluidos
          await CampaignSchedule.destroy({ where: { campaignId: props.id, status: CAMPAIGN_PENDING } });

          const startAt = startOfDay(new Date(body.scheduleAt)).toISOString();
          const endAt = endOfDay(new Date(body.scheduleAt)).toISOString();

          const schedules = await resource.Schedules.findMany({
            where: {
              accountId: newRecord.accountId,
              scheduleAt: {
                [Op.between]: [startAt, endAt],
              },
            },
          });

          await queuedAsyncMap(schedules, async (item) => {
            const schedule = await resource.Schedules.findById(item.id);

            await newRecord.addSchedule(schedule, { through: { status: CAMPAIGN_PENDING } });
          });
        }
      },
    });
  }

  async start({ campaignId, accountId }: { campaignId: string; accountId: string }) {
    const account = await resource.Accounts.findById(accountId);

    if (account.trial && (!account.credit || account.credit === 0)) {
      await CampaignsRepository.updateById(campaignId, { status: CAMPAIGN_DONE });
      await sendMessageDiscord({ message: `This account (${account.name}) is trial and does not avaliable credit` });

      throw new HttpError(500, `This account (${account.name}) does not avaliable credits`);
    }

    await CampaignsRepository.updateById(campaignId, { status: CAMPAIGN_PROCECSSING });

    return true;
  }
}

export default new CampaignsResource();
