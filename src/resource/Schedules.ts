import { Op } from 'sequelize';
import { startOfDay, endOfDay } from 'date-fns';
import BaseResource from './BaseResource';
import ScheduleRepository from '../repository/Schedules';
import { ScheduleInstance } from '../models/Schedules';
import ReportResource from './Reports';
import queuedAsyncMap from '../utils/queuedAsyncMap';
import ServiceResource from './Services';
import ServiceSchedule from '../models/ServiceSchedule';
import { HttpError } from '../utils/error/HttpError';
import resource from '.';
import { CAMPAIGN_DONE, CAMPAIGN_PENDING, CAMPAIGN_PROCECSSING } from '../constants/campaign';

export class ScheduleResource extends BaseResource<ScheduleInstance> {
  constructor() {
    super({
      entity: 'schedule',
      repository: ScheduleRepository,
      onCreated: async (props) => {
        const body = props.body as { services: { id: string; isPackage: boolean }[] };
        const newRecord = props.new as ScheduleInstance;

        if (body.services?.length) {
          await queuedAsyncMap(body.services, async (item) => {
            const service = await ServiceResource.findById(item.id);

            await newRecord.addService(service, { through: { isPackage: item.isPackage } });
          });
        }

        const startDay = startOfDay(new Date(newRecord.scheduleAt)).toISOString();
        const endDay = endOfDay(new Date(newRecord.scheduleAt)).toISOString();

        // check campanha active and add schedule
        const checkCampaign = await resource.Campaigns.findOne({
          where: {
            accountId: newRecord.accountId,
            scheduleAt: {
              [Op.between]: [startDay, endDay],
            },
          },
        });

        if (checkCampaign) {
          await checkCampaign.addSchedule(newRecord, { through: { status: CAMPAIGN_PENDING } });
          if (checkCampaign.status === CAMPAIGN_DONE) {
            await resource.Campaigns.updateById(checkCampaign.id, { status: CAMPAIGN_PROCECSSING });
          }
        }
      },
      onUpdated: async (props) => {
        const body = props.body as { services: { id: string; isPackage: boolean }[] };
        const newRecord = props.new as ScheduleInstance;

        if (body?.services && Array.isArray(body.services) && body.services.length) {
          // apagar todos os serviços desse agendamento
          await ServiceSchedule.destroy({ where: { scheduleId: props.id } });

          // criar novos serviços
          if (body.services?.length) {
            await queuedAsyncMap(body.services, async (item) => {
              const service = await ServiceResource.findById(item.id);

              await newRecord.addService(service, { through: { isPackage: item.isPackage } });
            });
          }
        }

        const report = await ReportResource.findOne({
          where: { scheduleId: props.id },
        });

        // verificar se existe relatorio desse agendamento
        if (report) {
          const schedule = await ScheduleRepository.findById(props.id);

          await ReportResource.createOrUpdate({
            scheduleId: props.id,
            reportId: report.id,
            accountId: schedule.accountId,
            addition: Number(newRecord.addition),
            discount: Number(newRecord.discount),
          });
        }
      },
      onDeleted: async ({ id }) => {
        const reportsBySchedule = await ReportResource.findMany({ where: { scheduleId: id } });

        await queuedAsyncMap(reportsBySchedule, async (item) => ReportResource.destroyById(item.id));
      },
    });
  }

  async changeStatus({
    id,
    status,
    accountId,
  }: {
    id: string;
    status: 'pending' | 'finished' | 'canceled';
    accountId: string;
  }) {
    const scheduleUpdated = await ScheduleRepository.updateById(id, { status });

    if (status === 'finished') {
      await ReportResource.createOrUpdate({
        scheduleId: scheduleUpdated.id,
        accountId,
        addition: scheduleUpdated.addition,
        discount: scheduleUpdated.discount,
      });
    }

    return true;
  }

  async revert(data: { scheduleId: string }) {
    const { scheduleId } = data;

    const schedule = await this.findById(scheduleId);
    if (!schedule) throw new HttpError(500, 'schedule not found');

    await this.updateById(schedule.id, { status: 'pending' });

    const reports = await ReportResource.findMany({
      where: { scheduleId: schedule.id },
    });

    await queuedAsyncMap(reports, async (item) => {
      await ReportResource.destroyById(item.id);
    });

    return true;
  }

  async confirmed(data: { scheduleId: string }) {
    const { scheduleId } = data;

    const schedule = await this.findById(scheduleId);
    if (!schedule) throw new HttpError(500, 'schedule not found');

    await this.updateById(schedule.id, { status: 'confirmed' });

    // send notification

    return true;
  }

  async canceled(data: { scheduleId: string }) {
    const { scheduleId } = data;

    const schedule = await this.findById(scheduleId);
    if (!schedule) throw new HttpError(500, 'schedule not found');

    await this.updateById(schedule.id, { status: 'canceled' });

    // send notification

    return true;
  }
}

export default new ScheduleResource();
