import { Model } from 'sequelize';
import User from './schema';
import type { UserCreateParams, UserFindByIdParams, UserFindParams, UserInstance } from './types';

export const createUser = async ({ name }: UserCreateParams) => User.create({ name });

export const findUserById = async ({ id }: UserFindByIdParams) => User.findByPk(id);

export const findUsers = async ({ limit, offset, query, sort }: UserFindParams) =>
  User.findAll<Model<UserInstance>>({
    where: query,
    limit,
    offset,
    order: sort,
  }).then((users) => users.map((user) => user.get()));
