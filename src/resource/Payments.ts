import PaymentsRepository from '../repository/Payments';
import { PaymentsInstance } from '../models/Payments';
import BaseResource from './BaseResource';

export class PaymentsResource extends BaseResource<PaymentsInstance> {
  constructor() {
    super({
      repository: PaymentsRepository,
      entity: 'Payments',
    });
  }

  async createOrUpdate(saleId, data) {
    const payment = await PaymentsRepository.findOne({
      where: { saleId },
    });

    if (!payment) {
      await PaymentsRepository.create({
        saleId,
        account: data.accountId,
        formOfPayment: data.formOfPayment,
        amountParcel: data.amountParcel,
      });

      return;
    }

    await PaymentsRepository.updateById(payment.id, {
      formOfPayment: data.formOfPayment,
      amountParcel: data.amountParcel,
    });
  }
}

export default new PaymentsResource();
