interface ErrorMessage {
  message: string;
  stack: object | string;
  status: number;
  service: string;
  headers: object;
  body: object;
  data?: object;
}

import Bull = require("bull");

import { Request } from "express";

const errorQueue = new Bull("error-queue");

export const HandleError = (exception: any, request: Request) => {
  const Message: ErrorMessage = {
    message: exception.message || exception,
    stack: exception.stack || "No Stack for this error",
    status: exception.status || 500,
    service: "Login",
    headers: request.headers,
    body: request.body,
  };

  errorQueue.add({ error: Message });
  return;
};
