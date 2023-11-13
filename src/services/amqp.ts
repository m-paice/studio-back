import { Channel, Connection, Replies, connect } from 'amqplib';
import debug from 'debug';

import {
  AMQP_HOST,
  AMQP_PASSWORD,
  AMQP_PORT,
  AMQP_USERNAME,
  EXCHANGE_NAME,
  QUEUE_NAME,
  QueueName,
} from '../constants/amqp';

const logger = debug('@amqp');

interface PublishInExchangeOptions<T> {
  message: T;
}
interface ConsumerOptions {
  queue: QueueName;
  callback(message: string): void;
}

export class AmqpServer {
  private conn: Connection;

  private channel: Channel;

  constructor() {
    this.conn = {} as Connection;
    this.channel = {} as Channel;
  }

  async start(): Promise<void> {
    try {
      const connection = await connect({
        username: AMQP_USERNAME,
        password: AMQP_PASSWORD,
        hostname: AMQP_HOST,
        port: AMQP_PORT,
      });

      logger('amqp is ready');

      this.conn = connection;
      this.channel = await this.conn.createChannel();
    } catch (error) {
      console.error(error);
    }
  }

  // setup
  async setup(): Promise<void> {
    await this.channel.assertExchange(EXCHANGE_NAME, 'fanout', { durable: false });

    const assertQueue = await this.channel.assertQueue(QUEUE_NAME, { durable: true });

    await this.channel.bindQueue(assertQueue.queue, EXCHANGE_NAME, '');
  }

  // sender
  async publishQueue<T>({ message }: PublishInExchangeOptions<T>): Promise<boolean> {
    const payload = JSON.stringify(message);

    return this.channel.publish(EXCHANGE_NAME, '', Buffer.from(payload));
  }

  // listener
  async consumer({ queue, callback }: ConsumerOptions): Promise<Replies.Consume> {
    return this.channel.consume(queue, (message) => {
      if (!message) return;

      callback(message.content.toString());
      this.channel.ack(message);
    });
  }
}

export const amqpClient = new AmqpServer();
