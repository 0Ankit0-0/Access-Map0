import rateLimit from 'express-rate-limit';

// Rate limiter for authentication routes
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for incident reporting
export const incidentRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 incident reports per minute
  message: 'Too many incident reports, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
