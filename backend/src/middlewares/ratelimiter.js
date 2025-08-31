import rateLimit from 'express-rate-limit';

export const checkoutRateLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 7,             
  message: {
    status: 429,
    message: 'Too many checkout attempts from this IP. Please try again in a minute.'
  },
  standardHeaders: true, 
  legacyHeaders: false,
});
