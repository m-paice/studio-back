import BillingsRepository from '../repository/Billings';
import { BillingInstance } from '../models/Billings';
import BaseResource from './BaseResource';

export class BillingsResource extends BaseResource<BillingInstance> {
  constructor() {
    super({
      repository: BillingsRepository,
      entity: 'Billing',
    });
  }
}

export default new BillingsResource();
