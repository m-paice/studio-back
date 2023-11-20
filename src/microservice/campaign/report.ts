import { CAMPAIGN_DONE, CAMPAIGN_PENDING } from '../../constants/campaign';
import CampaignSchedule from '../../repository/CampaignSchedule';
import resource from '../../resource';
import { HttpError } from '../../utils/error/HttpError';

type Status = 'pending' | 'sent' | 'ready' | 'failed';

interface ReportData {
  campaignId: string;
  scheduleId: string;
  status: Status;
}

export async function createReport({ campaignId, scheduleId, status }: ReportData) {
  const campaign = await resource.Campaigns.findById(campaignId, { include: ['schedules'] });

  if (!campaign) throw new HttpError(500, `campaign ${campaignId} not found`);
  if (!campaign.schedules.length) throw new HttpError(500, 'campaign no has schedules');
  if (campaign.status === CAMPAIGN_DONE) throw new Error('campaign is finished');

  const campaignSchedule = await CampaignSchedule.findOne({
    where: {
      campaignId,
      scheduleId,
    },
  });

  await CampaignSchedule.update(campaignSchedule, { status }, {});

  if ((await CampaignSchedule.count({ where: { status: CAMPAIGN_PENDING } })) === 0) {
    await resource.Campaigns.updateById(campaignId, { status: CAMPAIGN_DONE });
  }
}
