import { Op } from 'sequelize';

import ReportRepository from '../repository/Reports';
import { ReportInstance } from '../models/Reports';
import BaseResource from './BaseResource';
import ScheduleResource from './Schedules';
import Models from '../models';
import { ServiceInstance } from '../models/Services';

export class ReportResource extends BaseResource<ReportInstance> {
  constructor() {
    super({
      repository: ReportRepository,
      entity: 'Report',
    });
  }

  async reports({ startAt, endAt }: { startAt: Date; endAt: Date }, query) {
    const defaultWhere = {
      createdAt: {
        [Op.between]: [startAt, endAt],
      },
    };

    const reports = await ReportRepository.findMany({
      ...query,
      where: {
        ...query.where,
        ...defaultWhere,
      },
      include: [
        {
          model: Models.Schedules,
          as: 'schedule',
          include: [
            { model: Models.Users, as: 'user', attributes: ['name'] },
            { model: Models.Users, as: 'employee', attributes: ['name'] },
            { model: Models.Services, as: 'services', attributes: ['name'] },
          ],
        },
      ],
    });

    return {
      data: reports,
    };
  }

  async createOrUpdate({
    reportId = null,
    scheduleId,
    discount,
    addition,
    accountId,
  }: {
    scheduleId: string;
    reportId?: string | null;
    accountId: string;
    discount: number;
    addition: number;
  }) {
    const schedule = await ScheduleResource.findById(scheduleId, { include: ['services'] });

    const services = (schedule.services as ServiceInstance[]).filter((item) => !item.ServiceSchedule.isPackage);

    let total = services.reduce((acc, cur) => acc + cur.price, 0);

    if (discount) {
      total -= discount;
    }

    if (addition) {
      total += addition;
    }

    if (reportId) {
      await ReportRepository.updateById(reportId, {
        scheduleId,
        entry: total,
        accountId,
      });

      return;
    }

    await ReportRepository.create({
      scheduleId,
      entry: total,
      accountId,
    });
  }

  async registerOut(data: { description: string; value: number; accountId: string }) {
    return ReportRepository.create({
      accountId: data.accountId,
      out: data.value,
      description: data.description,
    });
  }
}

export default new ReportResource();
