import { Channel, Connection, Replies, connect } from 'amqplib';
import debug from 'debug';

import {
  AMQP_HOST,
  AMQP_PASSWORD,
  AMQP_PORT,
  AMQP_USERNAME,
  EXCHANGE_NAME,
  QUEUE_NAME,
  ROUTING_KEY_NAME,
  QUEUES,
} from '../constants/amqp';

const logger = debug('@amqp');

interface PublishInExchangeOptions<T> {
  message: T;
  routingKey: ROUTING_KEY_NAME;
}
interface ConsumerOptions {
  queue: QUEUE_NAME;
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
      console.error('Error in start', error);
    }
  }

  // setup
  async setup(): Promise<void> {
    try {
      if (!this.channel) throw new Error('Channel is not ready');

      await this.channel.assertExchange(EXCHANGE_NAME, 'topic', {
        durable: false,
      });

      // creating queue
      await Promise.all(QUEUES.map(async (item) => this.channel.assertQueue(item.name)));
      // bind queue with exchange
      await Promise.all(QUEUES.map(async (item) => this.channel.bindQueue(item.name, EXCHANGE_NAME, item.routingKey)));
    } catch (error) {
      console.error('Error in setup', error);
    }
  }

  // sender
  async publishInExchangeByRoutingKey<T>({ message, routingKey }: PublishInExchangeOptions<T>): Promise<boolean> {
    try {
      if (!this.channel) throw new Error('Channel is not ready');

      const payload = JSON.stringify(message);

      return this.channel.publish(EXCHANGE_NAME, routingKey, Buffer.from(payload));
    } catch (error) {
      console.error('Error in publishInExchangeByRoutingKey', error);
      return false;
    }
  }

  // listener
  async consumer({ queue, callback }: ConsumerOptions): Promise<Replies.Consume> {
    try {
      if (!this.channel) throw new Error('Channel is not ready');

      return this.channel.consume(queue, (message) => {
        if (!message) return;

        callback(message.content.toString());
        this.channel.ack(message);
      });
    } catch (error) {
      console.error('Error in consumer', error);
      return {} as Replies.Consume;
    }
  }
}

export const amqpClient = new AmqpServer();
