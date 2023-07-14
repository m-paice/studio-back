import { CreateOptions } from 'sequelize';
import BaseResource from './BaseResource';
import ScheduleRepository from '../repository/Schedules';
import { ScheduleInstance } from '../models/Schedules';
import ReportResource from './Reports';
import queuedAsyncMap from '../utils/queuedAsyncMap';
import ServiceResource from './Services';

export class ScheduleResource extends BaseResource<ScheduleInstance> {
  constructor() {
    super(ScheduleRepository);
  }

  async create(data: Partial<ScheduleInstance>): Promise<ScheduleInstance> {
    const schedule = await ScheduleRepository.create(data);

    if (data.services?.length) {
      await Promise.all(
        data.services.map(async (item) => {
          const service = await ServiceResource.findById(item);

          await schedule.addService(service);
        })
      );
    }

    return schedule;
  }

  async updateScheduleById(id, data, options?) {
    const schedule = await ScheduleRepository.findById(id);

    const scheduleUpdated = await ScheduleRepository.update(
      schedule,
      data,
      options
    );

    const report = await ReportResource.findOne({
      where: {
        scheduleId: scheduleUpdated.id,
      },
    });

    if (report) {
      await ReportResource.createOrUpdate({
        scheduleId: scheduleUpdated.id,
        serviceId: scheduleUpdated.serviceId,
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
    const scheduleUpdated = await ScheduleRepository.updateById(id, {
      status,
    });

    if (status === 'finished' && !scheduleUpdated.isPackage) {
      await ReportResource.createOrUpdate({
        scheduleId: scheduleUpdated.id,
        serviceId: scheduleUpdated.serviceId,
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
