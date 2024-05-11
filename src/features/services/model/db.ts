import { Model } from 'sequelize';
import Service from './schema';
import type {
  ServiceCreateParams,
  ServiceDestroyByIdParams,
  ServiceFindByIdParams,
  ServiceFindParams,
  ServiceInstance,
  ServiceUpdateByIdParams,
} from './types';

export const createService = async ({ data }: ServiceCreateParams) =>
  Service.create<Model<ServiceInstance>>(data).then((service) => service.get());

export const findServiceById = async ({ id }: ServiceFindByIdParams) =>
  Service.findByPk<Model<ServiceInstance>>(id).then((service) => service?.get());

export const findServices = async ({ limit, offset, query, sort }: ServiceFindParams) =>
  Service.findAll<Model<ServiceInstance>>({
    where: query,
    limit,
    offset,
    order: sort,
  }).then((Services) => Services.map((service) => service.get()));

export const updateServiceById = async ({ id, data }: ServiceUpdateByIdParams) =>
  Service.update<Model<ServiceInstance>>(data, { where: { id }, returning: true }).then(([rowsUpdated, [response]]) => {
    if (rowsUpdated === 0) return null;
    return response.get();
  });

export const deleteServiceById = async ({ id }: ServiceDestroyByIdParams) => Service.destroy({ where: { id } });
