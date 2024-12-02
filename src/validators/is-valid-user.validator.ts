import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraintInterface,
  ValidatorConstraint,
} from 'class-validator';
import { IsUserService } from '../services/is-user.service';

@ValidatorConstraint({ name: 'IsValidUser', async: true })
export class IsValidUserConstraint implements ValidatorConstraintInterface {
  constructor(private readonly isUserService: IsUserService) {}

  async validate(accountNumber: string) {
    const user = await this.isUserService.execute(accountNumber);
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
