import sequelize, { Op } from 'sequelize';
import ReportRepository from '../repository/Reports';
import { ReportInstance } from '../models/Reports';
import BaseResource from './BaseResource';
import ScheduleResource from './Schedules';
import ServiceResource from './Services';
import userResource from './Users';
import queuedAsyncMap from '../utils/queuedAsyncMap';

export class ReportResource extends BaseResource<ReportInstance> {
  constructor() {
    super(ReportRepository);
  }

  async reports({ startAt, endAt }: { startAt: Date; endAt: Date }) {
    const defaultWhere = {
      scheduleAt: {
        [Op.between]: [startAt, endAt],
      },
    };

    const [entry] = await ReportRepository.findMany({
      where: {
        createdAt: {
          [Op.between]: [startAt, endAt],
        },
      },
      attributes: [[sequelize.fn('sum', sequelize.col('entry')), 'total']],
      raw: true,
    });

    const [out] = await ReportRepository.findMany({
      where: {
        createdAt: {
          [Op.between]: [startAt, endAt],
        },
      },
      attributes: [[sequelize.fn('sum', sequelize.col('out')), 'total']],
      raw: true,
    });

    const countFinished = await ScheduleResource.count({
      where: {
        ...defaultWhere,
        status: 'finished',
      },
    });

    const countCanceled = await ScheduleResource.count({
      where: {
        ...defaultWhere,
        status: 'canceled',
      },
    });

    const countUsers = await userResource.count({
      where: {
        type: 'pf',
        createdAt: {
          [Op.between]: [startAt, endAt],
        },
      },
    });

    const services = await ServiceResource.findMany({});

    const serviceCount = await queuedAsyncMap(services, async (item) => {
      const countService = await ScheduleResource.count({
        where: {
          ...defaultWhere,
          serviceId: item.id,
        },
      });

      return { value: countService, item };
    });

    const fiveMaxService = serviceCount
      .sort((a, b) => (a.value < b.value ? 1 : -1))
      .slice(0, 5)
      .map(({ item, value }) => ({ name: item.name, value }));

    return {
      entry,
      out,
      countFinished,
      countCanceled,
      countUsers,
      serviceCount: fiveMaxService,
    };
  }
}

export default new ReportResource();
