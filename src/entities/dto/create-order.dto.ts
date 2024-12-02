import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  ValidateIf,
} from 'class-validator';
import {
  OrderSide,
  OrderSideEnum,
  OrderType,
  OrderTypeEnum,
} from '../../types/orders';
import { IsValidTicker } from '../../validators/is-valid-ticker.validator';
import { IsValidUser } from '../../validators/is-valid-user.validator';
export class CreateOrderDto {
  @IsNotEmpty()
  @IsValidUser()
  accountNumber: string;

  @ValidateIf(
    (object) => object.side !== 'CASH_IN' && object.side !== 'CASH_OUT',
  )
  @IsNotEmpty()
  @IsIn(OrderTypeEnum)
  type: OrderType;

  @ValidateIf(
    (object) => object.side !== 'CASH_IN' && object.side !== 'CASH_OUT',
  )
  @IsNotEmpty()
  @IsValidTicker()
  ticker: string;

  @ValidateIf(
    (object) =>
      !object.price || object.side === 'CASH_IN' || object.side === 'CASH_OUT',
  )
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  size: number;

  @ValidateIf((object) => !object.size)
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  @IsIn(OrderSideEnum)
  side: OrderSide;
}
