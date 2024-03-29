import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  message:
    'Limite de requisições excedido. Por favor, tente novamente mais tarde.',
  windowMs: 1 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
