import { BaseQueryValidator } from '@technical-challenge/validators';
import { z } from 'zod';

type BaseQuery = z.infer<typeof BaseQueryValidator>;

export type Query<T> = BaseQuery & {
    sortBy?: keyof T | undefined;
}
