import Service, { ServiceInstance } from '../models/Services';
import BaseRepository from './BaseRepository';

class ServiceRepository extends BaseRepository<ServiceInstance> {
  constructor() {
    super(Service);
  }
}

export default new ServiceRepository();
