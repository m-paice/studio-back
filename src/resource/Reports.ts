import { Op } from 'sequelize';

import ReportRepository from '../repository/Reports';
import { ReportInstance } from '../models/Reports';
import BaseResource from './BaseResource';
import ScheduleResource from './Schedules';
import ServiceResource from './Services';
import Schedules from '../models/Schedules';

export class ReportResource extends BaseResource<ReportInstance> {
  constructor() {
    super({
      repository: ReportRepository,
      entity: 'Report',
    });
  }

  async reports({ startAt, endAt }: { startAt: Date; endAt: Date }, query) {
    const defaultWhere = {
      scheduleAt: {
        [Op.between]: [startAt, endAt],
      },
    };

    const reports = await ReportRepository.findMany({
      ...query,
      include: [
        {
          model: Schedules,
          as: 'schedule',
          where: {
            ...defaultWhere,
            ...query.where,
            status: 'finished',
          },
        },
      ],
    });

    const response = reports.reduce(
      (acc, cur) => ({
        entry: acc.entry + cur.entry,
        out: acc.out + cur.out,
      }),
      {
        entry: 0,
        out: 0,
      },
    );

    const countFinished = await ScheduleResource.count({
      where: {
        ...defaultWhere,
        ...query.where,
        status: 'finished',
      },
    });

    const countCanceled = await ScheduleResource.count({
      where: {
        ...defaultWhere,
        ...query.where,
        status: 'canceled',
      },
    });

    const registerOut = await ReportRepository.findMany({
      where: {
        createdAt: {
          [Op.between]: [startAt, endAt],
        },
        ...query.where,
      },
    });

    const valueRegisterOut = registerOut.reduce((acc, cur) => acc + cur.out, 0);

    return {
      entry: response.entry,
      out: response.out + valueRegisterOut,
      countFinished,
      countCanceled,
    };
  }

  async createOrUpdate({
    reportId = null,
    servicesId,
    scheduleId,
    discount,
    addition,
    accountId,
  }: {
    reportId?: string | null;
    servicesId: string[];
    scheduleId: string;
    discount: number;
    addition: number;
    accountId: string;
  }) {
    const services = await ServiceResource.findMany({
      where: { id: { $in: servicesId } },
    });

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
