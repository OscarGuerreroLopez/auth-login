import { cleanEnv, str, num } from "envalid";

const GetEnvVars = () => {
  const envVars = cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: str(),
    REDIS_PORT: num({ default: 6379 }),
    REDIS_HOST: str(),
    JWT_SECRET: str(),
    RECAPTCHA_SECRET_KEY: str(),
  });

  return envVars;
};

export const EnvVars = GetEnvVars();
