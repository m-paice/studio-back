import Template, { TemplateInstance } from '../models/Templates';
import BaseRepository from './BaseRepository';

class TemplateRepository extends BaseRepository<TemplateInstance> {
  constructor() {
    super(Template);
  }
}

export default new TemplateRepository();
