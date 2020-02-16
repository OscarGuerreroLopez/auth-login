import { Injectable, HttpException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { ActivityService } from "../users/activity.service";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { User, CreateActivity, ActivityType } from "auth-modules";
import { LockService } from "./lock.service";

interface DataBody {
  email: string;
  password: string;
  recaptcha: string;
  brandId: string;
  ip: string;
  agent: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly activityService: ActivityService,
    private readonly jwtService: JwtService,
    private readonly lockService: LockService,
  ) {}

  async validateUser(data: DataBody): Promise<User> {
    let valid: boolean = false;

    // tslint:disable-next-line:no-shadowed-variable
    const User: User = await this.usersService.getUser(
      data.email,
      data.brandId,
    );

    if (!User.password) {
      throw new HttpException(
        `User with email ${User.email} ${
          data.brandId
        } does not have a password in the system`,
        401,
      );
    }

    try {
      await this.lockService.getWrongPassword(
        User.iduser!,
        data.brandId,
        User.email!,
      );
    } catch (error) {
      throw new HttpException(error, 403);
    }

    if (User.status !== "active") {
      const Activity: CreateActivity = {
        iduser: User.iduser!,
        type: ActivityType.USER_NOT_ACTIVE,
        email: User.email!,
        brandId: data.brandId,
      };

      this.activityService.createActivity(Activity);

      throw new HttpException(
        `User with email ${User.email} ${
          data.brandId
        } is not active in the system status ${User.status}`,
        401,
      );
    }

    valid = await bcrypt.compare(data.password, User.password);

    if (!valid) {
      const Activity: CreateActivity = {
        iduser: User.iduser!,
        type: ActivityType.USER_WRONG_PASSWORD,
        email: User.email!,
        brandId: data.brandId,
      };

      this.activityService.createActivity(Activity);

      this.lockService.wrongPassword(User.iduser!, data.brandId);

      throw new HttpException(
        `Wrong password for ${User.email} at ${data.brandId}`,
        401,
      );
    }
    // {
    //   email: 'oscar.computer.guy@gmail.com',
    //   password: 'Abc123!@',
    //   recaptcha: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
    //   brandId: 'brand_three',
    //   ip: '::1',
    //   agent: 'PostmanRuntime/7.22.0'
    // }
    const payload = {
      username: User.email || "",
      sub: User.iduser || 0,
      brand: data.brandId || "",
      role: User.role || "",
      status: User.status,
      ip: data.ip,
      agent: data.agent,
    };

    this.activityService.createRefreshToken(payload);

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
