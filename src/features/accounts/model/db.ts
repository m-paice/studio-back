import { Model } from 'sequelize';
import Account from './schema';
import type {
  AccountCreateParams,
  AccountFindByIdParams,
  AccountFindParams,
  AccountInstance,
  AccountUpdateByIdParams,
} from './types';

export const createAccount = async ({ name }: AccountCreateParams) =>
  Account.create({
    name,
  });

export const findAccountById = async ({ id }: AccountFindByIdParams) => Account.findByPk(id);

export const findAccount = async ({ query, limit, offset, sort }: AccountFindParams) =>
  Account.findAll<Model<AccountInstance>>({
    where: query,
    limit,
    offset,
    order: [sort],
  }).then((data) => data.map((item) => item.get()));

export const updateAccountById = async ({ id, data }: AccountUpdateByIdParams) =>
  Account.update(data, { where: { id } });
