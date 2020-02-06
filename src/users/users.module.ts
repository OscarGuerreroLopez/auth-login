import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ActivityService } from "./activity.service";

@Module({
  providers: [UsersService, ActivityService],
  exports: [UsersService, ActivityService],
})
export class UsersModule {}
