import { Op } from 'sequelize';
import { endOfDay, startOfDay } from 'date-fns';

import BaseResource from './BaseResource';
import ScheduleRepository from '../repository/Schedules';
import Schedule, { ScheduleInstance } from '../models/Schedules';
import queuedAsyncMap from '../utils/queuedAsyncMap';
import ServiceSchedule from '../models/ServiceSchedule';
import resource from '.';
import { CAMPAIGN_PENDING, CAMPAIGN_PROCECSSING } from '../constants/campaign';
import CampaignSchedule from '../models/CampaignSchedule';

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
            const service = await resource.Services.findById(item.id);

            await newRecord.addService(service, { through: { isPackage: item.isPackage } });
          });
        }

        const startAt = startOfDay(new Date(newRecord.scheduleAt)).toISOString();
        const endAt = endOfDay(new Date(newRecord.scheduleAt)).toISOString();

        const campaignInScheduleAt = await resource.Campaigns.findMany({
          where: {
            accountId: newRecord.accountId,
            scheduleAt: {
              [Op.between]: [startAt, endAt],
            },
            [Op.or]: [{ status: CAMPAIGN_PENDING }, { status: CAMPAIGN_PROCECSSING }],
          },
        });

        if (campaignInScheduleAt.length) {
          await queuedAsyncMap(campaignInScheduleAt, async (campaign) => {
            await campaign.addSchedule(newRecord, { through: { status: CAMPAIGN_PENDING } });
          });
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
              const service = await resource.Services.findById(item.id);

              await newRecord.addService(service, { through: { isPackage: item.isPackage } });
            });
          }
        }

        const report = await resource.Reports.findOne({
          where: { scheduleId: props.id },
        });

        // verificar se existe relatorio desse agendamento
        if (report) {
          await resource.Reports.createOrUpdate({
            scheduleId: props.id,
            reportId: report.id,
            accountId: newRecord.accountId,
            addition: Number(newRecord.addition),
            discount: Number(newRecord.discount),
          });
        }

        // verificar se existe campanha no dia do agendamento e se o agendamento ja esta na campanha
        const startAt = startOfDay(new Date(newRecord.scheduleAt)).toISOString();
        const endAt = endOfDay(new Date(newRecord.scheduleAt)).toISOString();

        const campaignInScheduleAt = await resource.Campaigns.findMany({
          where: {
            accountId: newRecord.accountId,
            scheduleAt: {
              [Op.between]: [startAt, endAt],
            },
            [Op.or]: [{ status: CAMPAIGN_PENDING }, { status: CAMPAIGN_PROCECSSING }],
          },
          include: [
            {
              model: Schedule,
              as: 'schedules',
              where: {
                id: {
                  [Op.not]: newRecord.id,
                },
              },
            },
          ],
        });

        if (campaignInScheduleAt.length) {
          await queuedAsyncMap(campaignInScheduleAt, async (campaign) => {
            await campaign.addSchedule(newRecord, { through: { status: CAMPAIGN_PENDING } });
          });
        }
      },
      onDeleted: async ({ id }) => {
        const reportsBySchedule = await resource.Reports.findMany({ where: { scheduleId: id } });

        await queuedAsyncMap(reportsBySchedule, async (item) => resource.Reports.destroyById(item.id));

        const campaignInScheduleAt = await resource.Campaigns.findMany({
          include: [
            {
              model: Schedule,
              as: 'schedules',
              where: {
                id,
              },
            },
          ],
        });

        if (campaignInScheduleAt.length) {
          await queuedAsyncMap(campaignInScheduleAt, async (campaign) => {
            await CampaignSchedule.destroy({
              where: {
                campaignId: campaign.id,
                scheduleId: id,
              },
            });
          });
        }
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
    const scheduleUpdated = await this.updateById(id, { status });

    if (status === 'finished') {
      await resource.Reports.createOrUpdate({
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

    await this.updateById(schedule.id, {
      status: 'pending',
    });

    const reports = await resource.Reports.findMany({
      where: {
        scheduleId: schedule.id,
      },
    });

    await queuedAsyncMap(reports, async (item) => {
      await resource.Reports.destroyById(item.id);
    });

    return true;
  }
}

export default new ScheduleResource();
