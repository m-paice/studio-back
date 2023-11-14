import CampaignUser, { CampaignUserInstance } from '../models/CampaignUser';
import BaseRepository from './BaseRepository';

class CampaignUserRepository extends BaseRepository<CampaignUserInstance> {
  constructor() {
    super(CampaignUser);
  }
}

export default new CampaignUserRepository();
