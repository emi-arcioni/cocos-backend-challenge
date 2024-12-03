import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  ValidateIf,
} from 'class-validator';
import { OrderSide, OrderType } from '../../types/orders';
import { IsValidTicker } from '../../validators/is-valid-ticker.validator';
import { IsValidUser } from '../../validators/is-valid-user.validator';
export class CreateOrderDto {
  @IsNotEmpty()
  @IsValidUser()
  accountNumber: string;

  @ValidateIf(
    (object) =>
      object.side !== OrderSide.CASH_IN && object.side !== OrderSide.CASH_OUT,
  )
  @IsNotEmpty()
  @IsIn(Object.values(OrderType))
  type: OrderType;

  @ValidateIf(
    (object) =>
      object.side !== OrderSide.CASH_IN && object.side !== OrderSide.CASH_OUT,
  )
  @IsNotEmpty()
  @IsValidTicker()
  ticker: string;

  @ValidateIf(
    (object) =>
      !object.price ||
      object.side === OrderSide.CASH_IN ||
      object.side === OrderSide.CASH_OUT,
  )
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  size: number;

  @ValidateIf((object) => !object.size || object.type === OrderType.LIMIT)
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  @IsIn(Object.values(OrderSide))
  side: OrderSide;
}
