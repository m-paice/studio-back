import { CampaignInstance } from '../models/Campaigns';
import CampaignsRepository from '../repository/Campaigns';
import BaseResource from './BaseResource';
import queuedAsyncMap from '../utils/queuedAsyncMap';
import UserResource from './Users';
import ScheduleResource from './Schedules';
import { amqpClient } from '../services/amqp';

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

            await newRecord.addUser(user);
          });
        }

        if (body.schedules?.length) {
          await queuedAsyncMap(body.schedules, async (item) => {
            const schedule = await ScheduleResource.findById(item);

            await newRecord.addSchedule(schedule);
          });
        }
      },
    });
  }

  async start({ campaignId }: { campaignId: string }) {
    const campaign = await CampaignsRepository.findById(campaignId, { include: ['users', 'template'] });

    if (!campaign) throw new Error('campaign not found!');

    const payload = campaign.users.map((item) => ({
      content: campaign.content,
      phoneNumber: item.cellPhone,
    }));

    await Promise.all(payload.map(async (item) => amqpClient.publishQueue({ message: item })));

    await CampaignsRepository.updateById(campaignId, { status: 'processing' });

    return true;
  }
}

export default new CampaignsResource();
