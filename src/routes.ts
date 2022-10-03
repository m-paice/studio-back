import { Router } from 'express';

const routes = Router();

routes.get('/', (req, res) => res.json({ message: 'welcome to API!' }));

export default routes;
