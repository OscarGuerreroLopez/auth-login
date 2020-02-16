import { Injectable } from "@nestjs/common";
import Bull = require("bull");
import { CreateActivity, CreateRefreshToken } from "auth-modules";

@Injectable()
export class ActivityService {
  activityQueue = new Bull("activity-queue");
  refreshTokenQueue = new Bull("refresh-queue");

  async createActivity(activity: CreateActivity) {
    this.activityQueue.add(activity);
  }

  async createRefreshToken(data: CreateRefreshToken) {
    this.refreshTokenQueue.add(data);
  }
}
