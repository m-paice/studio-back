import { Options, FindOptions, CreateOptions } from 'sequelize';
import BaseSequelizeRepository from '../repository/BaseRepository';

import eventEmitters from '../services/eventEmitters';

export const CREATED = 'created';
export const UPDATED = 'updated';
export const DESTROYED = 'destroyed';

export type Instance = {
  id: string;
};

export interface IOptions<T> extends FindOptions<T> {
  dontEmit?: boolean;
}

export default class BaseResource<TModel extends Instance> {
  protected readonly repository: BaseSequelizeRepository<TModel>;

  protected readonly entity: string;

  protected events: string[];

  constructor(repository: BaseSequelizeRepository<TModel>, entity = 'none') {
    this.repository = repository;
    this.entity = entity;
    this.events = [CREATED, UPDATED, DESTROYED];

    this.getRepository = this.getRepository.bind(this);
    this.findMany = this.findMany.bind(this);
    this.findOne = this.findOne.bind(this);
    this.findById = this.findById.bind(this);

    this.create = this.create.bind(this);

    this.update = this.update.bind(this);
    this.updateById = this.updateById.bind(this);

    this.destroy = this.destroy.bind(this);
    this.destroyById = this.destroyById.bind(this);

    this.emit = this.emit.bind(this);
    this.emitCreated = this.emitCreated.bind(this);
    this.emitUpdated = this.emitUpdated.bind(this);
    // this.emitDestroyed = this.emitDestroyed.bind(this)

    // this.reload = this.reload.bind(this)
    // this.count = this.count.bind(this)
    // this.findManyPaginated = this.findManyPaginated.bind(this)
    // this.findManyByIds = this.findManyByIds.bind(this)
    // this.bulkUpdate = this.bulkUpdate.bind(this)
    // this.bulkDestroy = this.bulkDestroy.bind(this)
    // this.existsById = this.existsById.bind(this)
    // this.exists = this.exists.bind(this)
    // this.build = this.build.bind(this)
  }

  /**
   * @returns {BaseSequelizeRepository}
   */
  getRepository() {
    return this.repository;
  }

  emit(event: string, data: Instance | Instance[] | any) {
    if ((Array.isArray(data) && !data.length) || !data) return null;

    return eventEmitters.emit(event, data);
  }

  on(event, listener) {
    return eventEmitters.on(event, listener);
  }

  emitCreated(data) {
    return this.emit(`${this.entity}.${CREATED}`, data);
  }

  emitUpdated(data) {
    return this.emit(`${this.entity}.${UPDATED}`, data);
  }

  findMany(query: FindOptions<TModel>) {
    return this.getRepository().findMany(query);
  }

  findById(id: string, query?: FindOptions<TModel>): Promise<TModel> {
    return this.getRepository().findById(id, query);
  }

  findOne(query: FindOptions<TModel>): Promise<TModel> {
    return this.getRepository().findOne(query);
  }

  count(query: FindOptions<TModel>): Promise<number> {
    return this.getRepository().count(query);
  }

  create(data: Partial<TModel>, options?: CreateOptions): Promise<TModel> {
    return this.getRepository()
      .create(data, options)
      .then((response) => {
        this.emitCreated(response);
        return response;
      });
  }

  update(
    model: TModel,
    data: Partial<TModel>,
    options: IOptions<TModel> = {
      dontEmit: false,
    }
  ) {
    return this.getRepository()
      .update(model, data, options)
      .then((response) => {
        if (!options.dontEmit) this.emitUpdated(response);
        return response;
      });
  }

  updateById(
    id: string,
    data: Partial<TModel>,
    options: IOptions<TModel> = {
      dontEmit: false,
    }
  ) {
    return this.getRepository()
      .findById(id, options)
      .then((model) => this.update(model, data, options));
  }

  destroy(model: TModel, options: Options = {}) {
    return this.getRepository()
      .destroy(model, options)
      .then(() => model);
  }

  destroyById(id: string, options: Options = {}) {
    return this.getRepository()
      .findById(id, options)
      .then((model) => this.destroy(model, options));
  }
}
