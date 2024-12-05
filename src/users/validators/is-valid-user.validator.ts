import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraintInterface,
  ValidatorConstraint,
} from 'class-validator';
import { UsersService } from '../users.service';

@ValidatorConstraint({ name: 'IsValidUser', async: true })
export class IsValidUserConstraint implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UsersService) {}

  async validate(accountNumber: string) {
    const user = await this.usersService.findOne(accountNumber);
    return !!user;
  }

  defaultMessage() {
    return 'User $value is not valid';
  }
}

export function IsValidUser(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidUserConstraint,
    });
  };
}
