import { Request, Response, NextFunction } from 'express';
import winston from 'winston';

const remoteLog = new winston.transports.Http({
  host: 'localhost',
  port: 3001,
  path: '/errors',
});

const consoleLog = new winston.transports.Console();

function getRequestLogFormatter() {
  const { combine, timestamp, printf } = winston.format;

  return combine(
    timestamp(),
    printf((info: any) => {
      const { req, res } = info.message;
      return `${info.timestamp} ${info.level}: ${req.hostname}${
        req.port || ''
      }${req.originalUrl}`;
    })
  );
}

function createRequestLogger(
  transports: winston.transports.ConsoleTransportInstance[]
) {
  const requestLogger = winston.createLogger({
    format: getRequestLogFormatter(),
    transports,
  });

  return function logRequest(req: Request, res: Response, next: NextFunction) {
    requestLogger.info({ req, res });
    next();
  };
}

function createErrorLogger(
  transports: [
    winston.transports.HttpTransportInstance,
    winston.transports.ConsoleTransportInstance
  ]
) {
  const errLogger = winston.createLogger({
    level: 'error',
    transports,
  });

  return function logError(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    errLogger.error({ err, req, res });
    next();
  };
}

// logger for application

const CATEGORY = 'application';

const logConfiguration = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.label({
      label: CATEGORY,
    }),
    winston.format.timestamp(),
    winston.format.printf(
      (info) =>
        `${info.timestamp} - ${info.label}:[${info.level}]: ${info.message}`
    )
  ),
};

const logger = winston.createLogger(logConfiguration);

function createDebugLogger(message: string, level = 'info') {
  return logger.log({
    message,
    level,
  });
}

export default {
  requestLogger: createRequestLogger([consoleLog]),
  errorLogger: createErrorLogger([remoteLog, consoleLog]),
  debugLogger: createDebugLogger,
};
