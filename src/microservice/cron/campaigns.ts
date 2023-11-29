import { subHours, isAfter } from 'date-fns';

import { CAMPAIGN_PENDING, CAMPAIGN_PROCECSSING } from '../../constants/campaign';
import resource from '../../resource';
import queuedAsyncMap from '../../utils/queuedAsyncMap';
import { sendMessage } from '../whatsapp';
import Account from '../../models/Accounts';
import Schedule from '../../models/Schedules';
import Services from '../../models/Services';
import User from '../../models/Users';
import CampaignSchedule, { CampaignScheduleInstance } from '../../models/CampaignSchedule';

export const handleCampaigns = async () => {
  const campaigns = await resource.Campaigns.findMany({
    where: {
      status: CAMPAIGN_PROCECSSING,
    },
    include: [
      'template',
      'account',
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
    if (!campaign.account.credit || campaign.account.credit === 0) return;

    await queuedAsyncMap(campaign.schedules, async (schedule) => {
      if (!schedule.account.credit || schedule.account.credit === 0) return;

      const campaignSchedule = (await CampaignSchedule.findOne({
        where: {
          campaignId: campaign.id,
          scheduleId: schedule.id,
        },
      })) as unknown as CampaignScheduleInstance;
      if (campaignSchedule.status !== CAMPAIGN_PENDING) return;

      const schedulePreviousTime = subHours(new Date(schedule.scheduleAt), campaign.timeBeforeSchedule);

      if (isAfter(new Date(), schedulePreviousTime)) {
        await sendMessage({
          campaign,
          schedule,
        });

        if (schedule.account.credit > 0) {
          await resource.Accounts.updateById(schedule.account.id, { credit: schedule.account.credit - 1 });
        }
      }
    });
  });
};
