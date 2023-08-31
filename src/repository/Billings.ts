import Billing, { BillingInstance } from '../models/Billings';
import BaseRepository from './BaseRepository';

class BillingRepository extends BaseRepository<BillingInstance> {
  constructor() {
    super(Billing);
  }
}

export default new BillingRepository();
