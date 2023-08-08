import dotenv from 'dotenv';
import express, { Express } from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import debug from 'debug';

import routes from './routes';

// services
import setupSequelize from './services/setupSequelize';
// microservices
import routesApi from './microservice/api/routes';
// middleware
import { limiter } from './middleware/rateLimit';

class Server {
  private express: Express;

  private PORT = process.env.PORT;

  private logger: debug.Debugger;

  constructor() {
    this.express = express();
    this.logger = debug('@server');
    dotenv.config();
  }

  async init() {
    this.middlewares();
    this.routes();
    await this.database();

    this.express.listen(this.PORT, () => {
      this.logger(`server listening on port ${this.PORT}`);
    });
  }

  async database() {
    await setupSequelize();
  }

  middlewares() {
    this.express.use(cors());
    this.express.use(morgan('dev'));
    this.express.use(bodyParser.json({ limit: '50mb' }));
    this.express.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(limiter);
  }

  routes() {
    this.express.use(routes);
    this.express.use('/api/v1', routesApi);
  }
}

const server = new Server();
server.init();
