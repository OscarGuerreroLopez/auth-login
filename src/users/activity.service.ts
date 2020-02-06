import { Injectable } from "@nestjs/common";
import Bull = require("bull");
import { CreateActivity } from "auth-modules";

@Injectable()
export class ActivityService {
  activityQueue = new Bull("activity-queue");

  async createActivity(activity: CreateActivity) {
    this.activityQueue.add(activity);
  }
}
