import { amqpClient } from '../../services/amqp';
import resource from '../../resource';
import { CampaignInstance } from '../../models/Campaigns';
import { ScheduleInstance } from '../../models/Schedules';

interface Send {
  campaign: CampaignInstance;
  schedule: ScheduleInstance;
}

export async function sendMessage({ campaign, schedule }: Send) {
  const template = await resource.Templates.findById(campaign.templateId);

  const payload = {
    message: template.content,
    phoneNumber: `55${schedule.user.cellPhone}`,
    info: {
      campaignId: campaign.id,
      scheduleId: schedule.id,
      account: schedule.account.name,
    },
  };

  await amqpClient.publishInExchangeByRoutingKey({ routingKey: 'message', message: payload });
}
