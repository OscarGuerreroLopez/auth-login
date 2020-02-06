import {
  Controller,
  Post,
  Request,
  UseGuards,
  HttpCode,
  Response,
  UseFilters,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request as Express_Req, Response as Express_Res } from "express";

import { AuthService } from "./auth/auth.service";
import { HttpExceptionFilter } from "./common/exceptions/http-exception.filter";

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard("local"))
  @Post("login")
  @UseFilters(HttpExceptionFilter)
  @HttpCode(200)
  async login(@Request() req: Express_Req, @Response() res: Express_Res) {
    const RESPONSE = await this.authService.login(req.user!, req.body.brandId);
    res.cookie("accessToken", RESPONSE.access_token);
    res.status(200).json(RESPONSE);
  }
}
