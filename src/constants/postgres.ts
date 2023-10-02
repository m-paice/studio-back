export const POSTGRES_MAX_CONNECTIONS = process.env.POSTGRES_MAX_CONNECTIONS
  ? parseInt(process.env.POSTGRES_MAX_CONNECTIONS, 10)
  : 25;

export const POSTGRES_MIN_CONNECTIONS = process.env.POSTGRES_MIN_CONNECTIONS
  ? parseInt(process.env.POSTGRES_MIN_CONNECTIONS, 10)
  : 10;

export const POSTGRES_MAX_RETRIES = process.env.POSTGRES_MAX_RETRIES
  ? parseInt(process.env.POSTGRES_MAX_RETRIES, 10)
  : 10;
