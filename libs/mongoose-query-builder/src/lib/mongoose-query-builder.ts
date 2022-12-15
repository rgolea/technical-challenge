import { Query } from '@technical-challenge/shared-types';
import { FilterQuery } from 'mongoose';

export function buildQuery<T>(query: Query<T>): FilterQuery<T> {
  return {
    ...query.limit ? { limit: query.limit } : null,
    ...(query.sort && query.sortBy ? {
      sort: {
        [query.sortBy]: query.sort === 'asc' ? 1 : -1
      }
    } : null),
    ...(query.after || query.before ? {
      [query.sortBy as PropertyKey]: {
        ...(query.after ? {
          $gt: query.after
        } : null), ...(query.before ? {
          $lt: query.before
        } : null)
      }
    } : {}),
  };
}
