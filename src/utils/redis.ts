import * as redis from "redis";
import { EnvVars } from "../common/getEnv";
import { logger } from "../common/logging/logger";

export const RedisClient = redis.createClient({
  host: EnvVars.REDIS_HOST,
  port: EnvVars.REDIS_PORT,
  enable_offline_queue: false,
});

RedisClient.on("connect", () => {
  logger.info("Redis client connected for Login");
});

RedisClient.on("error", (err: any) => {
  logger.error("Error connecting to Redis from Login", { data: err });
  process.exit(1);
});
