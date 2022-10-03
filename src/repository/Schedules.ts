import Schedule, { ScheduleInstance } from '../models/Schedules';
import BaseRepository from './BaseRepository';

class ScheduleRepository extends BaseRepository<ScheduleInstance> {
  constructor() {
    super(Schedule);
  }
}

export default new ScheduleRepository();
