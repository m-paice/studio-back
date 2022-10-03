import eventEmitters from '../../services/eventEmitters';

export default class App {
  async onStart() {}

  async onDeath() {
    eventEmitters.removeAllListeners();
  }
}
