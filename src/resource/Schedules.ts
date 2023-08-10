import BaseResource from './BaseResource';
import ScheduleRepository from '../repository/Schedules';
import { ScheduleInstance } from '../models/Schedules';
import ReportResource from './Reports';
import queuedAsyncMap from '../utils/queuedAsyncMap';
import ServiceResource from './Services';
import ServiceSchedule from '../models/ServiceSchedule';

export class ScheduleResource extends BaseResource<ScheduleInstance> {
  constructor() {
    super({
      entity: 'schedule',
      repository: ScheduleRepository,
      onCreated: async (props) => {
        const body = props.body as { services: string[] };
        const newRecord = props.new as ScheduleInstance;

        if (body.services?.length) {
          await queuedAsyncMap(body.services, async (item) => {
            const service = await ServiceResource.findById(item);

            await newRecord.addService(service);
          });
        }
      },
      onDeleted: async ({ id }) => {
        const reportsBySchedule = await ReportResource.findMany({ where: { scheduleId: id } });

        await queuedAsyncMap(reportsBySchedule, async (item) => ReportResource.destroyById(item.id));
      },
    });
  }

  async updateScheduleById(id, data, options?) {
    const schedule = await ScheduleRepository.findById(id);

    const scheduleUpdated = await ScheduleRepository.update(schedule, data, options);

    // apagar todos os serviços desse agendamento
    await ServiceSchedule.destroy({ where: { scheduleId: schedule.id } });

    // criar novos serviços
    if (data.services?.length) {
      await Promise.all(
        data.services.map(async (item) => {
          const service = await ServiceResource.findById(item);

          await schedule.addService(service);
        }),
      );
    }

    const report = await ReportResource.findOne({
      where: {
        scheduleId: scheduleUpdated.id,
      },
    });

    const schduleServices = await ScheduleRepository.findById(id, {
      include: ['services'],
    });

    if (report) {
      await ReportResource.createOrUpdate({
        scheduleId: scheduleUpdated.id,
        servicesId: schduleServices.services.map((item) => item.id),
        addition: scheduleUpdated.addition,
        discount: scheduleUpdated.discount,
        reportId: report.id,
        accountId: data.accountId,
      });
    }

    return scheduleUpdated;
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

    const schduleServices = await ScheduleRepository.findById(id, {
      include: ['services'],
    });

    if (status === 'finished' && !scheduleUpdated.isPackage) {
      await ReportResource.createOrUpdate({
        scheduleId: scheduleUpdated.id,
        servicesId: schduleServices.services.map((item) => item.id),
        addition: scheduleUpdated.addition,
        discount: scheduleUpdated.discount,
        accountId,
      });
    }

    return true;
  }

  async revert(data: { scheduleId: string }) {
    const { scheduleId } = data;

    const schedule = await ScheduleRepository.findById(scheduleId);

    await ScheduleRepository.updateById(schedule.id, {
      status: 'pending',
    });

    const reports = await ReportResource.findMany({
      where: {
        scheduleId: schedule.id,
      },
    });

    await queuedAsyncMap(reports, async (item) => {
      await ReportResource.destroyById(item.id);
    });

    return true;
  }
}

export default new ScheduleResource();
