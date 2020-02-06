import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";

@Injectable()
export class LoginValidationPipe implements PipeTransform {
  // tslint:disable-next-line:ban-types
  constructor(private readonly schema: any) {}

  transform(value: any) {
    const { error } = this.schema.validate(value);
    if (error) {
      throw new BadRequestException(error.details[0].message);
    }
    return value;
  }
}
