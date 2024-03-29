import { pick } from 'lodash';
import debug from 'debug';
import { Options, FindOptions, CreateOptions } from 'sequelize';
import BaseSequelizeRepository from '../repository/BaseRepository';

import eventEmitters from '../services/eventEmitters';

const logger = debug('@base_controller');

export const CREATED = 'created';
export const UPDATED = 'updated';
export const DESTROYED = 'destroyed';

export interface IOptions<T> extends FindOptions<T> {
  dontEmit?: boolean;
}

interface CallbackOnCreateParams<T> {
  id: string;
  new: T;
  body: unknown;
}

interface CallbackOnDeletedParams {
  id: string;
}

interface CallbackOnUpdateParams<T> {
  id: string;
  old: T;
  new: T;
  body: unknown;
}

export type Instance = {
  id: string;
};

type PaginatedOptions<T> = IOptions<T> & {
  page?: number | string;
  perPage?: number | string;
};

interface BaseControllerOptions<K> {
  repository: BaseSequelizeRepository<K>;
  entity: string;
  onCreated?: <T>(options: CallbackOnCreateParams<T>) => Promise<void>;
  onDeleted?: (options: CallbackOnDeletedParams) => Promise<void>;
  onUpdated?: <T>(options: CallbackOnUpdateParams<T>) => Promise<void>;
}

export default class BaseResource<TModel extends Instance> {
  protected readonly repository: BaseSequelizeRepository<TModel>;

  protected readonly entity: string;

  protected events: string[];

  onCreated?: <T>(options: CallbackOnCreateParams<T>) => Promise<void>;

  onDeleted?: (options: CallbackOnDeletedParams) => Promise<void>;

  onUpdated?: <T>(options: CallbackOnUpdateParams<T>) => Promise<void>;

  constructor(options: BaseControllerOptions<TModel>) {
    this.repository = options.repository;
    this.entity = options.entity;
    this.events = [CREATED, UPDATED, DESTROYED];

    this.onCreated = options.onCreated;
    this.onDeleted = options.onDeleted;
    this.onUpdated = options.onUpdated;

    this.getRepository = this.getRepository.bind(this);
    this.findManyPaginated = this.findManyPaginated.bind(this);
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

  async findManyPaginated(options: PaginatedOptions<TModel> = {}) {
    const DEFAULT_PER_PAGE = 10;
    const DEFAULT_PAGE = 1;

    const page = parseInt(`${options.page || DEFAULT_PAGE}`, 10);
    const perPage = parseInt(`${options.perPage || DEFAULT_PER_PAGE}`, 10);
    const from = (page - 1) * perPage;
    const to = page * perPage;
    const limit = to - from;

    const q = {
      offset: from,
      limit,
      ...pick(options, ['where', 'order', 'include']),
    };

    const count = await this.getRepository().count({ ...q, distinct: true });
    const result = await this.getRepository().findMany(q);

    const lastPage = Math.ceil(count / perPage) || 1;

    return {
      data: result,
      total: count,
      limit: q.limit,
      skip: q.offset,
      currentPage: page,
      lastPage,
      from,
      to,
    };
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
      .then(async (response) => {
        if (this.onCreated) {
          await this.onCreated({ id: response.id, new: response, body: data }).catch((errorCallback) => {
            logger('error on callback create: ', {
              error: errorCallback,
            });
          });
        }

        return response;
      });
  }

  update(
    model: TModel,
    data: Partial<TModel>,
    options: IOptions<TModel> = {
      dontEmit: false,
    },
  ): Promise<TModel> {
    return this.getRepository()
      .update(model, data, options)
      .then((response) => response);
  }

  updateById(
    id: string,
    data: Partial<TModel>,
    options: IOptions<TModel> = {
      dontEmit: false,
    },
  ) {
    return this.getRepository()
      .findById(id, options)
      .then((model) =>
        this.update(model, data, options).then((response) => {
          if (this.onUpdated) {
            this.onUpdated({
              id,
              new: response,
              old: model,
              body: data,
            }).catch((errorCallback) => {
              logger('error on callback update: ', {
                error: errorCallback,
              });
            });
          }

          return response;
        }),
      );
  }

  destroy(model: TModel, options: Options = {}): Promise<void> {
    return this.getRepository().destroy(model, options);
  }

  destroyById(id: string, options: Options = {}) {
    return this.getRepository()
      .findById(id, options)
      .then((model) => {
        this.destroy(model, options).then(() => {
          if (this.onDeleted) {
            this.onDeleted({ id }).catch((errorCallback) => {
              logger('error on callback delete: ', {
                error: errorCallback,
              });
            });
          }
        });

        return true;
      });
  }
}
