import dotenv from 'dotenv';
import express, { Express } from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';

import routes from './routes';
import routesApi from './microservice/api/routes';
import setupSequelize from './services/setupSequelize';

// microservices
import Workers from './microservice/workers/App';
import EventsEmitters from './microservice/emitters/App';

dotenv.config();

class Server {
  private express: Express;

  private PORT = process.env.PORT;

  constructor() {
    this.express = express();

    this.init();
  }

  init() {
    this.middlewares();
    this.routes();
    this.database();

    this.express.listen(this.PORT, () =>
      console.log(`server online in port ${this.PORT}`)
    );

    this.microservices();
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
  }

  routes() {
    this.express.use(routes);
    this.express.use('/api/v1', routesApi);
  }

  microservices() {
    const workers = new Workers();
    const eventEmitters = new EventsEmitters();

    workers.onStart();
    eventEmitters.onStart();
  }
}

const server = new Server();
