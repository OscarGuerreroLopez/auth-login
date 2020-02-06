import {
  ClientProxyFactory,
  Transport,
  ClientProxy,
} from "@nestjs/microservices";

import { EnvVars } from "../common/getEnv";

export const RedisClientProxy: ClientProxy = ClientProxyFactory.create({
  transport: Transport.REDIS,
  options: {
    url: `redis://${EnvVars.REDIS_HOST}:${EnvVars.REDIS_PORT}`,
    retryAttempts: 4,
    retryDelay: 10,
  },
});
