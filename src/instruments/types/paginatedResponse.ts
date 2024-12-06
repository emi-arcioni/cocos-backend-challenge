import { PaginationMeta } from './paginationMeta';

export type PaginatedResponse<T> = {
  items: T[];
  meta: PaginationMeta;
};
