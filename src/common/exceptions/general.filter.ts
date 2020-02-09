import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";

import { Request, Response } from "express";

import { logger } from "../logging/logger";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;

    if (request.body.password) {
      request.body.password = "*********";
    }

    if (exception instanceof HttpException) {
      status = 400;

      logger.warn(exception.message, { body: request.body, exception });
    } else {
      logger.error(exception.message, { body: request.body, exception });
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    response.status(status).json({
      message: "We can put whatever we want here, real error is logged",
    });
  }
}
