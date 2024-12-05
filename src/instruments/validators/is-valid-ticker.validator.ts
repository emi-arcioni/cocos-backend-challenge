import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraintInterface,
  ValidatorConstraint,
} from 'class-validator';
import { InstrumentsService } from '../instruments.service';

@ValidatorConstraint({ name: 'isValidTicker', async: true })
export class IsValidTickerConstraint implements ValidatorConstraintInterface {
  constructor(private readonly instrumentsService: InstrumentsService) {}

  async validate(ticker: string) {
    const instrument = await this.instrumentsService.findByTicker(ticker);
    return !!instrument;
  }

  defaultMessage() {
    return 'Ticker $value is not valid';
  }
}

export function IsValidTicker(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidTickerConstraint,
    });
  };
}
