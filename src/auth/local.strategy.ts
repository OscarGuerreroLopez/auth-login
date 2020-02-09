import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, HttpException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request } from "express";
import { LoginSchema } from "../common/schemas";
import { GetRecaptcha } from "../utils/recaptcha";
import { User } from "auth-modules";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ passReqToCallback: true, usernameField: "email" });
  }

  async validate(request: Request): Promise<User> {
    await LoginSchema.validateAsync(request.body);

    const RECAPTCHA = await GetRecaptcha(
      request.body.recaptcha,
      request.clientIp!,
    );

    if (!RECAPTCHA) {
      throw new HttpException("User did not pass recaptcha", 401);
    }

    const user: User = await this.authService.validateUser(
      request.body.email,
      request.body.password,
      request.body.brandId,
    );

    return user;
  }
}
