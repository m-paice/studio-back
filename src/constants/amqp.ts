export type QUEUE_NAME = 'send' | 'receive' | 'user';
export type ROUTING_KEY_NAME = 'message' | 'report' | 'import';

export interface QueueOptions {
  name: QUEUE_NAME;
  routingKey: string;
}

export const AMQP_USERNAME = process.env.AMQP_USERNAME ? process.env.AMQP_USERNAME : 'user';
export const AMQP_PASSWORD = process.env.AMQP_PASSWORD ? process.env.AMQP_PASSWORD : 'password';
export const AMQP_HOST = process.env.AMQP_HOST ? process.env.AMQP_HOST : 'localhost';
export const AMQP_PORT = process.env.AMQP_PORT ? parseInt(process.env.AMQP_PORT, 10) : 5671;

export const EXCHANGE_NAME = 'record';
export const QUEUES = [
  { name: 'send', routingKey: 'message' },
  { name: 'receive', routingKey: 'report' },
  { name: 'user', routingKey: 'import' },
];
