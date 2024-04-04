import { Model } from 'sequelize';
import User from './schema';
import type {
  UserCreateParams,
  UserDestroyByIdParams,
  UserFindByIdParams,
  UserFindParams,
  UserInstance,
  UserUpdateByIdParams,
} from './types';

export const createUser = async ({ data }: UserCreateParams) =>
  User.create<Model<UserInstance>>(data).then((user) => user.get());

export const findUserById = async ({ id }: UserFindByIdParams) =>
  User.findByPk<Model<UserInstance>>(id).then((user) => user?.get());

export const findUsers = async ({ limit, offset, query, sort }: UserFindParams) =>
  User.findAll<Model<UserInstance>>({
    where: query,
    limit,
    offset,
    order: sort,
  }).then((users) => users.map((user) => user.get()));

export const updateUserById = async ({ id, data }: UserUpdateByIdParams) =>
  User.update<Model<UserInstance>>(data, { where: { id }, returning: true }).then(([rowsUpdated, [response]]) => {
    if (rowsUpdated === 0) return null;
    return response.get();
  });

export const deleteUserById = async ({ id }: UserDestroyByIdParams) => User.destroy({ where: { id } });
