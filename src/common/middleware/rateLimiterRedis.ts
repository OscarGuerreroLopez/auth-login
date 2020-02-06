import { Request, Response, NextFunction } from "express";
// tslint:disable-next-line:no-var-requires
const { RateLimiterRedis } = require("rate-limiter-flexible");

import { RedisClient } from "../../utils/redis";

const rateLimiter = new RateLimiterRedis({
  redis: RedisClient,
  keyPrefix: "middleware",
  points: 10, // 10 requests
  duration: 10, // per 10 seconds by IP
});

export const RateLimiterMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  rateLimiter
    .consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      res.status(429).send("Too Many Requests");
    });
};
