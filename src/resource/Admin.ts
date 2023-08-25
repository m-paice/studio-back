import AccountsResource from './Accounts';
import UserResource from './Users';

export class AdminResource {
  async users() {
    const response = await UserResource.findManyPaginated({});

    return response;
  }

  async accounts() {
    const response = await AccountsResource.findManyPaginated({});

    return response;
  }
}

export default new AdminResource();
