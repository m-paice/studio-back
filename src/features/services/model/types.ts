export type ServiceInstance = {
  id: string;
  accountId: string;
  name: string;
  price: number;
  type: string;
  image: string;
  porcent: number;
  averageTime: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export interface ServiceCreateParams {
  data: ServiceInstance;
}

export interface ServiceFindByIdParams {
  id: string;
}

export interface ServiceDestroyByIdParams {
  id: string;
}

export interface ServiceUpdateByIdParams {
  id: string;
  data: Partial<ServiceInstance>;
}

export interface ServiceFindParams {
  query?: any;
  limit?: number;
  offset?: number;
  sort?: any;
}
