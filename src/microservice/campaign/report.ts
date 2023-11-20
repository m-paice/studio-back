import { CAMPAIGN_DONE, CAMPAIGN_PENDING } from '../../constants/campaign';
import CampaignSchedule from '../../models/CampaignSchedule';
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

export async function createReport(data: ReportData) {
  const { campaignId, scheduleId, status } = data.message.data;

  try {
    if (!campaignId || !scheduleId || !status)
      throw new HttpError(500, `invalid params ${JSON.stringify(data.message.data)}`);

    const campaign = await resource.Campaigns.findById(campaignId);
    if (!campaign) throw new HttpError(500, `campaign ${campaignId} not found`);
    if (campaign.status === CAMPAIGN_DONE) throw new Error('campaign is finished');

    await CampaignSchedule.update(
      { status },
      {
        where: {
          campaignId,
          scheduleId,
        },
      },
    );

    const countItemsPending = await CampaignSchedule.count({
      where: { campaignId, status: CAMPAIGN_PENDING },
    });
    if (countItemsPending === 0) {
      await resource.Campaigns.updateById(campaignId, { status: CAMPAIGN_DONE });
    }
  } catch (error) {
    console.error(error);
  }
}
