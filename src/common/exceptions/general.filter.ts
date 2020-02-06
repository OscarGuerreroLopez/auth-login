import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common";
import { Request, Response } from "express";

import { HandleError } from "./handleError";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (request.body.password) {
      request.body.password = "*********";
    }

    HandleError(exception, request);

    response.status(500).json({
      message: "There was a problem, please contact support",
    });
  }
}
