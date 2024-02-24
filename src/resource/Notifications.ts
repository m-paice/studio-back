import NotificationsRepository from '../repository/Notifications';
import { NotificationsInstance } from '../models/Notifications';
import BaseResource from './BaseResource';

export class NotificationsResource extends BaseResource<NotificationsInstance> {
  constructor() {
    super({
      repository: NotificationsRepository,
      entity: 'Notifications',
    });
  }
}

export default new NotificationsResource();
