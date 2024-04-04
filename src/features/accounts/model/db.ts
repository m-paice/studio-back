import { Model } from 'sequelize';
import Account from './schema';
import type {
  AccountCreateParams,
  AccountDestroyByIdParams,
  AccountFindByIdParams,
  AccountFindParams,
  AccountInstance,
  AccountUpdateByIdParams,
} from './types';

export const createAccount = async ({ data }: AccountCreateParams) =>
  Account.create<Model<AccountInstance>>(data).then((response) => response.get());

export const findAccountById = async ({ id }: AccountFindByIdParams) =>
  Account.findByPk<Model<AccountInstance>>(id).then((data) => data?.get());

export const findAccount = async ({ query, limit, offset, sort }: AccountFindParams) =>
  Account.findAll<Model<AccountInstance>>({
    where: query,
    limit,
    offset,
    order: [sort],
  }).then((data) => data.map((item) => item.get()));

export const updateAccountById = async ({ id, data }: AccountUpdateByIdParams) =>
  Account.update<Model<AccountInstance>>(data, { where: { id }, returning: true }).then(([rowsUpdated, [response]]) => {
    if (rowsUpdated === 0) return null;
    return response.get();
  });

export const deleteAccountById = async ({ id }: AccountDestroyByIdParams) => Account.destroy({ where: { id } });
