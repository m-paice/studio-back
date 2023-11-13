import Campaign, { CampaignInstance } from '../models/Campaigns';
import BaseRepository from './BaseRepository';

class CampaignRepository extends BaseRepository<CampaignInstance> {
  constructor() {
    super(Campaign);
  }
}

export default new CampaignRepository();
