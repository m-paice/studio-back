import SalesRepository from '../repository/Sales';
import { SalesInstance } from '../models/Sales';
import BaseResource from './BaseResource';
import ProductResource from './Products';
import ReportResource from './Reports';
import queuedAsyncMap from '../utils/queuedAsyncMap';

interface Products {
  id: string;
  amount: number;
  price: number;
  discount: number;
  addition: number;
}

export class SalesResource extends BaseResource<SalesInstance> {
  constructor() {
    super(SalesRepository);
  }

  getTotal(data: { products: Products[] }) {
    const total = data.products.reduce((acc, cur) => {
      const itemSubtotal = cur.amount * cur.price - cur.discount + cur.addition;

      return acc + itemSubtotal;
    }, 0);

    return total;
  }

  async updateProductStock(data: Products[]) {
    await queuedAsyncMap(data, async (item) => {
      const product = await ProductResource.findById(item.id);

      await ProductResource.updateById(item.id, {
        amount: product.amount - item.amount,
      });
    });
  }

  async create(data): Promise<SalesInstance> {
    const total = this.getTotal(data);

    const saleCreated = await SalesRepository.create({
      ...data,
      total,
    });

    await queuedAsyncMap<Products, void>(data.products, async (item) => {
      const product = await ProductResource.findById(item.id);

      const subtotal =
        item.amount * product.price - item.discount + item.addition;

      await saleCreated.addProduct(product, {
        through: {
          amount: item.amount,
          addition: item.addition,
          discount: item.discount,
          subtotal,
        },
      });
    });

    await ReportResource.create({
      accountId: data.accountId,
      saleId: saleCreated.id,
      entry: total,
    });

    await this.updateProductStock(data.products);

    return saleCreated;
  }

  async updateSaleById(id, data, options = {}) {
    const total = this.getTotal(data);

    const oldSale = await SalesRepository.findById(id, { include: 'products' });

    const saleUpdated = await SalesRepository.updateById(id, {
      ...data,
      total,
    });

    await queuedAsyncMap(oldSale.products, async (item) => {
      const product = await ProductResource.findById(item.id);

      await oldSale.removeProduct(product);
    });

    await queuedAsyncMap<Products, void>(data.products, async (item) => {
      const product = await ProductResource.findById(item.id);

      const subtotal =
        item.amount * product.price - item.discount + item.addition;

      await saleUpdated.addProduct(product, {
        through: {
          amount: item.amount,
          addition: item.addition,
          discount: item.discount,
          subtotal,
        },
      });
    });

    const reportSale = await ReportResource.findOne({
      where: {
        saleId: saleUpdated.id,
      },
    });

    await ReportResource.updateById(reportSale.id, {
      entry: total,
    });

    return saleUpdated;
  }
}

export default new SalesResource();
