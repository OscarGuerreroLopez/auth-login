import { cleanEnv, str, num } from "envalid";

const GetEnvVars = () => {
  const envVars = cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: str(),
    REDIS_PORT: num({ default: 6379 }),
    REDIS_HOST: str(),
    MYSQL_PASS: str(),
    FROM_EMAIL: str(),
    SENDGRID_KEY: str(),
    VERIFY_ROUTE: str(),
    RABBIT_HOST: str(),
    RABBIT_PORT: num(),
    JWT_SECRET: str(),
    BRAND_NAME: str(),
    RECAPTCHA_SITE_KEY: str(),
    RECAPTCHA_SECRET_KEY: str(),
  });

  return envVars;
};

export const EnvVars = GetEnvVars();
