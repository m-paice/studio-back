import { subHours, isAfter } from 'date-fns';
import debug from 'debug';

import { CAMPAIGN_PENDING, CAMPAIGN_PROCECSSING } from '../../constants/campaign';
import resource from '../../resource';
import queuedAsyncMap from '../../utils/queuedAsyncMap';
import { sendMessage } from '../whatsapp';
import Account from '../../models/Accounts';
import Schedule from '../../models/Schedules';
import Services from '../../models/Services';
import User from '../../models/Users';
import CampaignSchedule, { CampaignScheduleInstance } from '../../models/CampaignSchedule';

const logger = debug('@campaign');

export const handleCampaigns = async () => {
  const campaigns = await resource.Campaigns.findMany({
    where: {
      status: CAMPAIGN_PROCECSSING,
    },
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

  await queuedAsyncMap(campaigns, async (campaign) => {
    await queuedAsyncMap(campaign.schedules, async (schedule) => {
      const campaignSchedule = (await CampaignSchedule.findOne({
        where: {
          campaignId: campaign.id,
          scheduleId: schedule.id,
        },
      })) as unknown as CampaignScheduleInstance;
      if (campaignSchedule.status !== CAMPAIGN_PENDING) return;
      if (schedule.status === 'canceled') return;

      const schedulePreviousTime = subHours(new Date(schedule.scheduleAt), campaign.timeBeforeSchedule);

      if (isAfter(new Date(), schedulePreviousTime)) {
        try {
          await sendMessage({
            campaign,
            schedule,
          });
        } catch (error) {
          logger('Failed to campaign to exchange: %O', error);
        }
      }
    });
  });
};
