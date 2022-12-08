import Payments, { PaymentsInstance } from '../models/Payments';
import BaseRepository from './BaseRepository';

class PaymentsRepository extends BaseRepository<PaymentsInstance> {
  constructor() {
    super(Payments);
  }
}

export default new PaymentsRepository();
