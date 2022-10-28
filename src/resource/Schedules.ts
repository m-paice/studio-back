import BaseResource from './BaseResource';
import ScheduleRepository from '../repository/Schedules';
import { ScheduleInstance } from '../models/Schedules';
import ReportResource from './Reports';

export class ScheduleResource extends BaseResource<ScheduleInstance> {
  constructor() {
    super(ScheduleRepository);
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
      });
    }

    return scheduleUpdated;
  }

  async changeStatus({
    id,
    status,
  }: {
    id: string;
    status: 'pending' | 'finished' | 'canceled';
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
      });
    }

    return true;
  }
}

export default new ScheduleResource();
