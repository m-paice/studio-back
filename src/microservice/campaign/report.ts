import { CAMPAIGN_DONE, CAMPAIGN_PENDING } from '../../constants/campaign';
import CampaignSchedule from '../../repository/CampaignSchedule';
import resource from '../../resource';
import { HttpError } from '../../utils/error/HttpError';

type Status = 'pending' | 'sent' | 'ready' | 'failed';

interface ReportData {
  message: {
    data: {
      campaignId: string;
      scheduleId: string;
      status: Status;
    };
  };
}

export async function createReport({
  message: {
    data: { campaignId, scheduleId, status },
  },
}: ReportData) {
  const campaign = await resource.Campaigns.findById(campaignId);

  if (!campaign) throw new HttpError(500, `campaign ${campaignId} not found`);
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
