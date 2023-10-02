import TemplatesRepository from '../repository/Templates';
import { TemplateInstance } from '../models/Templates';
import BaseResource from './BaseResource';

export class TemplatesResource extends BaseResource<TemplateInstance> {
  constructor() {
    super({
      repository: TemplatesRepository,
      entity: 'Template',
    });
  }
}

export default new TemplatesResource();
