const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const helmetMiddleware = helmet({
  contentSecurityPolicy: process.env.NODE_ENV === "production",
  crossOriginEmbedderPolicy: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: "Too many requests" },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many auth attempts" },
});

const compilerLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { success: false, message: "Compiler rate limit exceeded. Try again in a minute." },
});

module.exports = { helmetMiddleware, generalLimiter, authLimiter, compilerLimiter };
