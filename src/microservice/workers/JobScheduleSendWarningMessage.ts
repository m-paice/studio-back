import axios from 'axios';
import { addDays } from 'date-fns';
import { Op } from 'sequelize';
import Schedules from '../../resource/Schedules';
import queuedAsyncMap from '../../utils/queuedAsyncMap';

async function searchSchedules() {
  const startAt = addDays(new Date().setHours(0), 1);
  const endAt = addDays(new Date().setHours(23), 1);

  console.log('startAt: ', startAt);
  console.log('endAt: ', endAt);

  const schedules = await Schedules.findMany({
    where: {
      scheduleAt: {
        [Op.notBetween]: [startAt, endAt],
      },
      sent: false,
    },
    include: ['user'],
  });

  return schedules;
}

async function sendWarningMessage({ phoneNumber }) {
  const text =
    'Ola, seu atendimento esta marcado para amanhã!!! Podemos confirmar seu horário ?';

  try {
    const response = await axios.post(`${process.env.URL_API_WPP}/send-text`, {
      phoneNumber,
      text,
    });

    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
}

export async function handle() {
  const schedules = await searchSchedules();

  await queuedAsyncMap(schedules, async (item) => {
    if (!item.user.cellPhone) return;

    await sendWarningMessage({ phoneNumber: item.user.cellPhone });

    await Schedules.updateById(item.id, {
      sent: true,
    });
  });
}
