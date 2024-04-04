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
  data: UserInstance;
}

export interface UserFindByIdParams {
  id: string;
}

export interface UserDestroyByIdParams {
  id: string;
}

export interface UserUpdateByIdParams {
  id: string;
  data: Partial<UserInstance>;
}

export interface UserFindParams {
  query?: any;
  limit?: number;
  offset?: number;
  sort?: any;
}
