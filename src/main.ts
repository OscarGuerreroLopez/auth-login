import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as bodyParser from "body-parser";

import { AllExceptionsFilter } from "./common/exceptions/general.filter";
// import { LoggingInterceptor } from "./common/logging/logging.interceptor";
import { RateLimiterMiddleware } from "./common/middleware/rateLimiterRedis";
import { EnvVars } from "./common/getEnv";
import * as requestIp from "request-ip";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(requestIp.mw());
  app.useGlobalFilters(new AllExceptionsFilter());
  // app.useGlobalInterceptors(new LoggingInterceptor());
  app.use(bodyParser.json({ limit: "5mb" }));
  app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));
  app.use(RateLimiterMiddleware); // comment this out if you are running a load test
  app.enableCors();
  await app.listen(EnvVars.PORT, () => {
    console.log(`App running at port... ${EnvVars.PORT}`);
  });
}
bootstrap();
