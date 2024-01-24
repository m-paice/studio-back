import debug from 'debug';
import { Request, Response } from 'express';

import { sendMessageDiscord } from '../../services/discord';
import sequelize from '../../services/sequelize';

const logger = debug('@controller');

export default <T>(resource: any, whiteList?: string[]) => {
  const many = async (req: Request, res: Response) => {
    const { query } = req;

    try {
      const response = await resource
        .findMany({
          ...query,
          ...(whiteList && { include: whiteList }),
        })
        .then((data: Partial<T>) => ({ data }));

      return res.json(response);
    } catch (error: any) {
      logger('erro on find many controller', { error });
      sendMessageDiscord({ message: error.toString() });

      return res.status(500).json(error);
    }
  };

  const index = async (req: Request, res: Response) => {
    const { query } = req;

    try {
      let include: any = [];

      if (whiteList) include = whiteList;
      if (query.include) {
        include = [
          ...include,
          ...(query.include as any[]).map((item) => ({
            ...item,
            model: sequelize.models[item.model],
          })),
        ];
      }

      const response = await resource
        .findManyPaginated({
          ...query,
          include,
          order: query?.order || [['updatedAt', 'DESC']],
        })
        .then((data: Partial<T>) => data);

      return res.json(response);
    } catch (error: any) {
      logger('erro on index controller', { error });
      sendMessageDiscord({ message: error.toString() });
      return res.status(500).json(error);
    }
  };

  const show = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { query } = req;

    try {
      const response = await resource
        .findById(id, {
          ...query,
          ...(whiteList && { include: whiteList }),
        })
        .then((data: Partial<T>) => data);

      return res.json(response);
    } catch (error: any) {
      logger('erro on show controller', { error });
      sendMessageDiscord({ message: error.toString() });
      return res.status(500).json(error);
    }
  };

  const create = async (req: Request, res: Response) => {
    const { body, query } = req;

    try {
      const response = await resource.create(body, query).then((data: Partial<T>) => data);

      return res.json(response);
    } catch (error: any) {
      logger('erro on create controller', { error });
      sendMessageDiscord({ message: error.toString() });

      return res.status(500).json(error);
    }
  };

  const update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { body, query } = req;

    try {
      const response = await resource.updateById(id, body, query).then((data: Partial<T>) => data);

      return res.json(response);
    } catch (error: any) {
      logger('erro on update controller', { error });
      sendMessageDiscord({ message: error.toString() });
      return res.status(500).json(error);
    }
  };

  const destroy = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const response = await resource.destroyById(id).then((data: Partial<T>) => !!data);

      return res.json(response);
    } catch (error: any) {
      logger('erro on destroy controller', { error });
      sendMessageDiscord({ message: error.toString() });
      return res.status(500).json(error);
    }
  };

  return {
    many,
    index,
    show,
    create,
    update,
    destroy,
  };
};
