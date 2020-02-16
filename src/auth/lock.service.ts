import { Injectable } from "@nestjs/common";
import { RedisClient } from "../utils/redis";
import { RedisClientProxy } from "../utils/redisProxy";
import {
  CreateActivity,
  User,
  UserStatusEnum,
  ActivityType,
} from "auth-modules";
import Bull = require("bull");
import { timeout, first } from "rxjs/operators";

@Injectable()
export class LockService {
  activityQueue = new Bull("activity-queue");

  async wrongPassword(userId: number, brandId: string) {
    const KEY = `${brandId}.${userId}.failed`;

    RedisClient.incr(KEY);
    RedisClient.expire(KEY, 300); // 5 minutes = 300
  }

  async getWrongPassword(userId: number, brandId: string, email: string) {
    const KEY = `${brandId}.${userId}.failed`;
    return new Promise((resolve, reject) => {
      RedisClient.get(KEY, async (err, result: string) => {
        if (err) {
          reject(err);
        }
        // tslint:disable-next-line:radix
        const FAILED = parseInt(result);

        if (FAILED > 4) {
          const Activity: CreateActivity = {
            iduser: userId,
            type: ActivityType.USER_LOCKED,
            brandId,
            email,
          };

          this.activityQueue.add(Activity);

          const UpdateUser: Partial<User> = {
            iduser: userId,
            status: UserStatusEnum.SUSPENDED,
            brandId,
          };

          await RedisClientProxy.send("updateUser", UpdateUser)
            .pipe(
              timeout(5000),
              first(),
            )
            .toPromise();

          reject(`User ${userId} at ${brandId} is locked`);
        }

        resolve();
      });
    });
  }
}
