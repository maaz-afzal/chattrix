import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    msg: "Too many requests, please try again later.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    msg: "Too many authentication attempts, please try again later.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});

const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  message: {
    msg: "AI request limit reached, try again later.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});

export { apiLimiter, authLimiter, aiLimiter };
