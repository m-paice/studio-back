import HistoricPrices from '../../resource/HistoricPrices';
import eventEmitters from '../../services/eventEmitters';

export default class App {
  async onStart() {
    eventEmitters.on('products.updated', async (data) => {
      try {
        await HistoricPrices.create({
          productId: data.id,
          newValue: data.price,
        });
      } catch (error) {
        console.log(error);
      }
    });

    eventEmitters.on('products.created', async (data) => {
      try {
        await HistoricPrices.create({
          productId: data.id,
          newValue: data.price,
        });
      } catch (error) {
        console.log(error);
      }
    });
  }

  async onDeath() {
    eventEmitters.removeAllListeners();
  }
}
