import rateLimit from "express-rate-limit";

export const limierLogin = rateLimit({
  windowMs: 1000,
  max: 1,
  standardHeaders: true,
  message: "SLOW_DOWN",
  legacyHeaders: false,
});

export const limiterCaptcha = rateLimit({
  windowMs: 200,
  max: 1,
  standardHeaders: true,
  message: "SLOW_DOWN",
  legacyHeaders: false,
});

export const limiterGetBooks = rateLimit({
  windowMs: 50,
  max: 1,
  standardHeaders: true,
  message: "SLOW_DOWN",
  legacyHeaders: false,
});
