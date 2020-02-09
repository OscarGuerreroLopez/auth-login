import * as winston from "winston";

const { combine, timestamp, prettyPrint } = winston.format;

export const logger = winston.createLogger({
  level: "info",
  format: combine(timestamp(), prettyPrint()),
  defaultMeta: { service: "login" },
  transports: [
    new winston.transports.File({
      filename: "../logs/info.log",
      level: "info",
    }),
    new winston.transports.File({
      filename: "../logs/warn.log",
      level: "warn",
    }),
    new winston.transports.File({
      filename: "../logs/error.log",
      level: "error",
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}
