import http from 'http';
import ExtendableError from './ExtendableError';

export class HttpError extends ExtendableError {
  constructor(status = 500, message = http.STATUS_CODES[status]) {
    super();
    this.name = 'HttpError';
    this.status = status;
    this.message = message;
  }
}
