import Notifications, { NotificationsInstance } from '../models/Notifications';
import BaseRepository from './BaseRepository';

class NotificationsRepository extends BaseRepository<NotificationsInstance> {
  constructor() {
    super(Notifications);
  }
}

export default new NotificationsRepository();
