import {
  Model,
  Options,
  FindOptions,
  CreateOptions,
  UpdateOptions,
  DestroyOptions,
} from 'sequelize';

class BaseRepository<T> {
  private readonly model: any;

  constructor(model: any) {
    this.model = model;
  }

  findMany(options?: FindOptions<T>): Promise<T[]> {
    return this.model.findAll(options);
  }

  findOne(options: FindOptions<T>): Promise<T> {
    return this.model.findOne(options);
  }

  findById(id: string, options?: FindOptions<T>): Promise<T> {
    return this.model.findByPk(id, options);
  }

  count(options: FindOptions<T>): Promise<number> {
    return this.model.count(options);
  }

  create(data: Partial<T>, options?: CreateOptions): Promise<T> {
    return this.model.create(data, options);
  }

  update(model: any, data: Partial<T>, options: Options): Promise<T> {
    return model.update(data, options);
  }

  updateById(id: string, data: Partial<T>, options?: Options): Promise<T> {
    return this.findById(id, options).then((model) =>
      this.update(model, data, options)
    );
  }

  destroy(model: any, options: Options) {
    return model.destroy(options);
  }

  destroyById(id: string, options: Options) {
    return this.findById(id, options).then((model) =>
      this.destroy(model, options)
    );
  }
}

export default BaseRepository;
