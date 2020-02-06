import { Injectable } from "@nestjs/common";
import { RedisClientProxy } from "../utils/redisProxy";
import { timeout, first } from "rxjs/operators";
import { HttpException } from "@nestjs/common";
import { User } from "auth-modules";

@Injectable()
export class UsersService {
  async getUser(email: string, brandId: string): Promise<User> {
    try {
      const Result: User = await RedisClientProxy.send("getOneUser", {
        email,
        brandId,
      })
        .pipe(
          timeout(5000),
          first(),
        )
        .toPromise();

      return Result;
    } catch (error) {
      throw new HttpException(
        `Not able to get user with email ${email} at brand ${brandId} Error: ${
          error.message
        }`,
        404,
      );
    }
  }
}
