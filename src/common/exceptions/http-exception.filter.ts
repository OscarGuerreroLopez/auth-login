import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { Request, Response } from "express";
import { HandleError } from "./handleError";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (request.body.password) {
      request.body.password = "*********";
    }

    HandleError(exception, request);

    response.status(400).json({
      message: "Not able to process login, please try again or contact support",
    });
  }
}
