import CampaignSchedule, { CampaignScheduleInstance } from '../models/CampaignSchedule';
import BaseRepository from './BaseRepository';

class CampaignScheduleRepository extends BaseRepository<CampaignScheduleInstance> {
  constructor() {
    super(CampaignSchedule);
  }
}

export default new CampaignScheduleRepository();
