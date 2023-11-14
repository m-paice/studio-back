import { CampaignInstance } from '../models/Campaigns';
import CampaignsRepository from '../repository/Campaigns';
import BaseResource from './BaseResource';
import queuedAsyncMap from '../utils/queuedAsyncMap';
import UserResource from './Users';
import ScheduleResource from './Schedules';
import { amqpClient } from '../services/amqp';
import { HttpError } from '../utils/error/HttpError';
import Schedule from '../models/Schedules';
import User from '../models/Users';
import { CAMPAIGN_DONE, CAMPAIGN_PENDING, CAMPAIGN_PROCECSSING } from '../constants/campaign';

interface Content {
  userId?: string;
  scheduleId?: string;
  campaignId: string;
  content: string;
  phoneNumber: string;
}

export class CampaignsResource extends BaseResource<CampaignInstance> {
  constructor() {
    super({
      repository: CampaignsRepository,
      entity: 'Campaign',
      onCreated: async (props) => {
        const body = props.body as { users: string[]; schedules: string[] };
        const newRecord = props.new as CampaignInstance;

        if (body.users?.length) {
          await queuedAsyncMap(body.users, async (item) => {
            const user = await UserResource.findById(item);

            await newRecord.addUser(user, { through: { status: CAMPAIGN_PENDING } });
          });
        }

        if (body.schedules?.length) {
          await queuedAsyncMap(body.schedules, async (item) => {
            const schedule = await ScheduleResource.findById(item);

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

    if (campaign.users.length) {
      campaign.users.forEach((item) => {
        const content = {
          userId: item.id,
          campaignId,
          content: campaign.content,
          phoneNumber: item.cellPhone,
        };

        payload.push(content);
      });
    }

    if (campaign.schedules.length) {
      campaign.schedules.forEach((item) => {
        const content = {
          userId: item.user.id,
          scheduleId: item.id,
          campaignId,
          content: campaign.content,
          phoneNumber: item.user.cellPhone,
        };

        payload.push(content);
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
