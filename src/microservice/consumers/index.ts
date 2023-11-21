import { QUEUE_NAME } from '../../constants/amqp';
import { createReport } from './campaign';
import { importUsers } from './import';

export const consumers: [QUEUE_NAME, (data) => void][] = [
  ['receive', createReport],
  ['user', importUsers],
];
