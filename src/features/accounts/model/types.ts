export type AccountInstance = {
  id: string;
  name: string;
  type: string;
  trial: boolean;
  enable: boolean;
  dueDate: Date | null;
  isAutoCampaign: boolean;
  config: {
    startAt: number;
    endAt: number;
    days: {
      dom: boolean;
      seg: boolean;
      ter: boolean;
      qua: boolean;
      qui: boolean;
      sex: boolean;
      sab: boolean;
    };
  };
  token: string[];
  createdAt?: Date;
  updatedAt?: Date;
};

export interface AccountCreateParams {
  data: AccountInstance;
}
export interface AccountFindByIdParams {
  id: string;
}

export interface AccountDestroyByIdParams {
  id: string;
}
export interface AccountFindParams {
  query?: any;
  limit?: number;
  offset?: number;
  sort?: any;
}

export interface AccountUpdateByIdParams {
  id: string;
  data: Partial<AccountInstance>;
}
