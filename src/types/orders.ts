export type OrderType = 'MARKET' | 'LIMIT';
export type OrderSide = 'BUY' | 'SELL' | 'CASH_IN' | 'CASH_OUT';
export type OrderStatus = 'NEW' | 'FILLED' | 'REJECTED' | 'CANCELLED';

export const OrderTypeEnum: OrderType[] = ['MARKET', 'LIMIT'];

export const OrderSideEnum: OrderSide[] = [
  'BUY',
  'SELL',
  'CASH_IN',
  'CASH_OUT',
];

export const OrderStatusEnum: OrderStatus[] = [
  'NEW',
  'FILLED',
  'REJECTED',
  'CANCELLED',
];
