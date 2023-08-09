import debug from 'debug';
import { Request, Response } from 'express';
import { Includeable } from 'sequelize';

const logger = debug('@controller');

export default <T>(resource: any, whiteList?: string[] | Includeable | Includeable[]) => {
  const many = async (req: Request, res: Response) => {
    const { query } = req;

    try {
      const response = await resource
        .findMany({
          ...query,
          ...(whiteList && { include: whiteList }),
        })
        .then((data: Partial<T>) => data);

      return res.json(response);
    } catch (error) {
      logger('erro on find many controller', { error });

      return res.status(500).json(error);
    }
  };

  const index = async (req: Request, res: Response) => {
    const { query } = req;

    try {
      const response = await resource
        .findManyPaginated({
          ...query,
          ...(whiteList && { include: whiteList }),
          order: query?.order || [['updatedAt', 'DESC']],
        })
        .then((data: Partial<T>) => data);

      return res.json(response);
    } catch (error) {
      logger('erro on index controller', { error });
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
    } catch (error) {
      logger('erro on show controller', { error });
      return res.status(500).json(error);
    }
  };

  const create = async (req: Request, res: Response) => {
    const { body, query } = req;

    try {
      const response = await resource.create(body, query).then((data: Partial<T>) => data);

      return res.json(response);
    } catch (error) {
      logger('erro on create controller', { error });

      return res.status(500).json(error);
    }
  };

  const update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { body, query } = req;

    try {
      const response = await resource.updateById(id, body, query).then((data: Partial<T>) => data);

      return res.json(response);
    } catch (error) {
      logger('erro on update controller', { error });
      return res.status(500).json(error);
    }
  };

  const destroy = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const response = await resource.destroyById(id).then((data: Partial<T>) => !!data);

      return res.json(response);
    } catch (error) {
      logger('erro on destroy controller', { error });
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
