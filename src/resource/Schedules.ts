import BaseResource from './BaseResource';
import ScheduleRepository from '../repository/Schedules';
import { ScheduleInstance } from '../models/Schedules';
import ReportResource from './Reports';
import ServiceResource from './Services';

export class ScheduleResource extends BaseResource<ScheduleInstance> {
  constructor() {
    super(ScheduleRepository);
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
      const service = await ServiceResource.findById(scheduleUpdated.serviceId);

      let total = service.price;

      if (scheduleUpdated.discount) {
        total -= scheduleUpdated.discount;
      }

      if (scheduleUpdated.addition) {
        total += scheduleUpdated.addition;
      }

      await ReportResource.create({
        scheduleId: scheduleUpdated.id,
        entry: total,
        ...(service.type === 'partial' && {
          out: (total / 100) * service.price,
        }),
      });
    }

    return true;
  }
}

export default new ScheduleResource();
