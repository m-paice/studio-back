export type UserInstance = {
  id: string;
  accountId: string;
  name: string;
  type: string;
  cellPhone: string;
  password: string;
  isSuperAdmin: boolean;
  birthDate: string;
  theme: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export interface UserCreateParams {
  name: string;
}

export interface UserFindByIdParams {
  id: string;
}

export interface UserFindParams {
  query?: any;
  limit?: number;
  offset?: number;
  sort?: any;
}
