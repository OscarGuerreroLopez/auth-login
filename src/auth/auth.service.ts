import { Injectable, HttpException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { ActivityService } from "../users/activity.service";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { User, CreateActivity, ActivityType } from "auth-modules";
import { LockService } from "./lock.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly activityService: ActivityService,
    private readonly jwtService: JwtService,
    private readonly lockService: LockService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
    brandId: string,
  ): Promise<User> {
    let valid: boolean = false;

    // tslint:disable-next-line:no-shadowed-variable
    const User: User = await this.usersService.getUser(email, brandId);

    if (!User.password) {
      throw new HttpException(
        `User with email ${
          User.email
        } ${brandId} does not have a password in the system`,
        401,
      );
    }

    await this.lockService.getWrongPassword(User.iduser!, brandId, User.email!);

    if (User.status !== "active") {
      const Activity: CreateActivity = {
        iduser: User.iduser!,
        type: ActivityType.USER_NOT_ACTIVE,
        email: User.email!,
        brandId,
      };
      this.activityService.createActivity(Activity);
      throw new HttpException(
        `User with email ${User.email} ${brandId} is not active in the system`,
        401,
      );
    }

    valid = await bcrypt.compare(pass, User.password);

    if (!valid) {
      const Activity: CreateActivity = {
        iduser: User.iduser!,
        type: ActivityType.USER_WRONG_PASSWORD,
        email: User.email!,
        brandId,
      };

      this.activityService.createActivity(Activity);

      this.lockService.wrongPassword(User.iduser!, brandId);

      throw new HttpException(
        `Wrong password for ${User.email} at ${brandId}`,
        401,
      );
    }
    const { password, ...result } = User;
    return result;
  }

  async login(user: Partial<User>, brandId: string) {
    const payload = {
      username: user.email,
      sub: user.iduser,
      brand: brandId,
      role: user.role,
      status: user.status,
    };

    const Activity: CreateActivity = {
      iduser: user.iduser!,
      type: ActivityType.USER_LOGIN,
      email: user.email!,
      brandId,
    };

    this.activityService.createActivity(Activity);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
