import sequelize, { Op } from 'sequelize';
import ReportRepository from '../repository/Reports';
import { ReportInstance } from '../models/Reports';
import BaseResource from './BaseResource';
import ScheduleResource from './Schedules';
import ServiceResource from './Services';
import userResource from './Users';
import queuedAsyncMap from '../utils/queuedAsyncMap';
import Schedules from '../models/Schedules';

export class ReportResource extends BaseResource<ReportInstance> {
  constructor() {
    super(ReportRepository);
  }

  async reports({ startAt, endAt }: { startAt: Date; endAt: Date }) {
    console.log(startAt);
    console.log(endAt);

    const defaultWhere = {
      scheduleAt: {
        [Op.between]: [startAt, endAt],
      },
    };

    const reports = await ReportRepository.findMany({
      include: [
        {
          model: Schedules,
          as: 'schedule',
          where: {
            ...defaultWhere,
            status: 'finished',
          },
        },
      ],
    });

    const response = reports.reduce(
      (acc, cur) => {
        return {
          entry: acc['entry'] + cur.entry,
          out: acc['out'] + cur.out,
        };
      },
      {
        entry: 0,
        out: 0,
      }
    );

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

    const productPriceSugestion = response.entry * 0.1;

    const schedulesInfo = await ReportRepository.findMany({
      attributes: ['id'],
      include: [
        {
          model: Schedules,
          as: 'schedule',
          attributes: ['id'],
          include: ['service'],
          where: {
            ...defaultWhere,
            status: 'finished',
          },
        },
      ],
    });

    const employeeInfo = await ReportRepository.findMany({
      where: {
        out: {
          [Op.ne]: null,
        },
      },
      attributes: ['id', 'out'],
      include: [
        {
          model: Schedules,
          as: 'schedule',
          attributes: ['id'],
          include: ['employee'],
          where: {
            ...defaultWhere,
            status: 'finished',
          },
        },
      ],
    });

    return {
      entry: response.entry,
      out: response.out,
      countFinished,
      countCanceled,
      countUsers,
      serviceCount: fiveMaxService,
      productPriceSugestion,
      schedulesInfo,
      employeeInfo,
    };
  }
}

export default new ReportResource();
