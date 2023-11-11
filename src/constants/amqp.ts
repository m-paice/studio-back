export type QueueName = 'send';
export interface QueueOptions {
  name: QueueName;
  routingKey: string;
}

export const AMQP_USERNAME = process.env.AMQP_USERNAME ? process.env.AMQP_USERNAME : 'user';
export const AMQP_PASSWORD = process.env.AMQP_PASSWORD ? process.env.AMQP_PASSWORD : 'password';
export const AMQP_HOST = process.env.AMQP_HOST ? process.env.AMQP_HOST : 'localhost';
export const AMQP_PORT = process.env.AMQP_PORT ? parseInt(process.env.AMQP_PORT, 10) : 5671;

export const EXCHANGE_NAME = 'record';
export const QUEUE_NAME = 'send';
