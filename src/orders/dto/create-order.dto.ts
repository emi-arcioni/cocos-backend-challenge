import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  ValidateIf,
} from 'class-validator';
import { OrderSide } from '../enums/OrderSide.enum';
import { OrderType } from '../enums/OrderType.enum';
import { IsValidTicker } from '../../instruments/validators/is-valid-ticker.validator';
import { IsValidUser } from '../../users/validators/is-valid-user.validator';
export class CreateOrderDto {
  @IsNotEmpty()
  @IsValidUser()
  accountNumber: string;

  @ValidateIf(
    (object) => ![OrderSide.CASH_IN, OrderSide.CASH_OUT].includes(object.side),
  )
  @IsNotEmpty()
  @IsIn(Object.values(OrderType))
  type: OrderType;

  @ValidateIf(
    (object) => ![OrderSide.CASH_IN, OrderSide.CASH_OUT].includes(object.side),
  )
  @IsNotEmpty()
  @IsValidTicker()
  ticker: string;

  @ValidateIf(
    (object) =>
      (!object.price && !object.investmentAmount) ||
      [OrderSide.CASH_IN, OrderSide.CASH_OUT, OrderSide.SELL].includes(
        object.side,
      ),
  )
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  size: number;

  @ValidateIf(
    (object) => !object.price && !object.size && object.side === OrderSide.BUY,
  )
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  investmentAmount: number;

  @ValidateIf(
    (object) =>
      (!object.size && !object.investmentAmount) ||
      object.type === OrderType.LIMIT,
  )
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  @IsIn(Object.values(OrderSide))
  side: OrderSide;
}
