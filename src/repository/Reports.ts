import Report, { ReportInstance } from '../models/Reports';
import BaseRepository from './BaseRepository';

class ReportRepository extends BaseRepository<ReportInstance> {
  constructor() {
    super(Report);
  }
}

export default new ReportRepository();
