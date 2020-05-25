import { Injectable } from "@nestjs/common";
import Bull = require("bull");
import { CreateActivity, CreateRefreshToken } from "auth-modules";

const activityQueue = new Bull("activity-queue");
const refreshTokenQueue = new Bull("refresh-queue");

@Injectable()
export class ActivityService {
  async createActivity(activity: CreateActivity) {
    activityQueue.add(activity);
  }

  async createRefreshToken(data: CreateRefreshToken) {
    refreshTokenQueue.add(data);
  }
}
