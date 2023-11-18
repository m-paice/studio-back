import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import responseTime from 'response-time';
import client from 'prom-client';
import debug from 'debug';
import routes from './routes';

// services
import setupSequelize from './services/setupSequelize';
import { AmqpServer, amqpClient } from './services/amqp';
// microservices
import routesApi from './microservice/api/routes';
// middleware
import { limiter } from './middleware/rateLimit';

export const restResponseTimeDurationSeconds = new client.Histogram({
  name: 'rest_response_time_duration_seconds',
  help: 'REST API response time duration in seconds',
  labelNames: ['method', 'route', 'status_code'],
});

class Server {
  private express: Express;

  private PORT = process.env.PORT;

  private logger: debug.Debugger;

  amqpClient: AmqpServer;

  constructor() {
    this.express = express();
    this.logger = debug('@server');
    this.amqpClient = amqpClient;
    dotenv.config();
  }

  async init() {
    this.middlewares();
    this.routes();
    this.metrics();
    await this.database();
    await this.microservices();

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
    this.express.use(
      responseTime((req: Request, res: Response, time: number) => {
        restResponseTimeDurationSeconds.observe(
          {
            method: req.method,
            route: req.originalUrl,
            status_code: res.statusCode,
          },
          time * 1000,
        );
      }),
    );
  }

  routes() {
    this.express.use(routes);
    this.express.use('/api/v1', routesApi);
  }

  async microservices() {
    await this.amqpClient.start();
    await this.amqpClient.setup();
    await amqpClient.consumer({
      queue: 'receive',
      callback: async (message) => {
        console.log(`data from queue receive: ${JSON.parse(message)}`);
      },
    });
  }

  metrics() {
    this.express.get('/metrics', async (req, res) => {
      res.set('Content-Type', client.register.contentType);
      return res.send(await client.register.metrics());
    });
  }
}

const server = new Server();
server.init();
