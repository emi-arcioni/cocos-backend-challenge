export type FindInstrumentsOptions = {
  ticker?: string;
  name?: string;
};

export enum InstrumentType {
  ACCIONES = 'ACCIONES',
  MONEDA = 'MONEDA',
}

export enum Currency {
  USD = 'USD',
  ARS = 'ARS',
}
