import { format, subHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import resource from '../../resource';
import { amqpClient } from '../../services/amqp';
import { CampaignInstance } from '../../models/Campaigns';
import { ScheduleInstance } from '../../models/Schedules';
import { ServiceInstance } from '../../models/Services';

// function substituirVariaveis(template, variaveis) {
//   return template.replace(/\{\{(\w+)\}\}/g, (match: string, variavel: string) => variaveis[variavel] || match);
// }

function formatPhoneNumber(number: string): string {
  const regex = /^(\+55|55)/;

  if (regex.test(number)) {
    const formattedNumber = number.replace(regex, '');
    return formattedNumber;
  }

  return number;
}

interface Send {
  campaign: CampaignInstance;
  schedule: ScheduleInstance;
}

export async function sendMessage({ campaign, schedule }: Send) {
  const template = await resource.Templates.findById(campaign.templateId);

  const nameClient = schedule.user.name;
  const accountName = schedule.account.name;
  const services = (schedule.services as ServiceInstance[]).map((service) => service.name).join(', ');
  const date = format(subHours(new Date(schedule.scheduleAt), 3), 'dd MMMM', { locale: ptBR });
  const hour = format(subHours(new Date(schedule.scheduleAt), 3), 'HH:mm');
  let time = '';

  if (campaign.timeBeforeSchedule === 1) {
    time = '1 hora';
  } else if (campaign.timeBeforeSchedule > 1 && campaign.timeBeforeSchedule < 24) {
    time = `${campaign.timeBeforeSchedule} horas`;
  } else {
    time = '1 dia';
  }

  const userAdmin = await resource.Users.findOne({
    where: {
      accountId: schedule.accountId,
      isSuperAdmin: true,
    },
  });
  const phoneAccount = userAdmin.cellPhone;

  const payload = {
    client: nameClient,
    account: accountName,
    services,
    date,
    hour,
    timeBefore: time,
    phoneAccount,
    template: template.name,
    phoneNumber: `55${formatPhoneNumber(schedule.user.cellPhone)}`,
    content: '',
    scheduleId: schedule.id,
    campaignId: campaign.id,
  };

  // const variaveis = {
  //   nomecliente: nameClient,
  //   nomeconta: accountName,
  //   servicos: services,
  //   data: date,
  //   horario: hour,
  //   tempo: time,
  //   numeroconta: phoneAccount,
  // };
  // const content = substituirVariaveis(template.content, variaveis);

  await amqpClient.publishInExchangeByRoutingKey({ routingKey: 'message', message: payload });
}
