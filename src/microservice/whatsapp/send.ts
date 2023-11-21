import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

  const userAdmin = await resource.Users.findOne({
    where: {
      accountId: campaign.accountId,
      isSuperAdmin: true,
    },
  });

  const selectDay = format(new Date(schedule.scheduleAt), 'dd/MMMM', { locale: ptBR });
  const dayOfWeek = format(new Date(schedule.scheduleAt), 'cccc', { locale: ptBR });
  const selectHour = format(new Date(schedule.scheduleAt), 'HH:mm', { locale: ptBR });

  const payload = {
    template: template.name,
    data: {
      to: `+55${schedule.user.cellPhone}`,
      client: schedule.user.name,
      account: schedule.account.name,
      service: schedule.services.map((service) => service.name).join(' + '),
      date: `${selectDay} (${dayOfWeek})`,
      time: selectHour,
      scheduleTime: campaign.timeBeforeSchedule.toString(),
      link: `https://wa.me/55${userAdmin.cellPhone}`,
      adminCellPhone: userAdmin.cellPhone,
    },
    info: {
      campaignId: campaign.id,
      scheduleId: schedule.id,
    },
  };

  await amqpClient.publishInExchangeByRoutingKey({ routingKey: 'message', message: payload });
}
