import { z } from 'zod';
import { DateValidator } from '../primitives/date.validator';
import { GroupIDValidator } from '../primitives/group-id.validator';
import { BaseQueryValidator } from '../queries/query';

export const GroupValidator = z.object({
    group: GroupIDValidator,
    createdAt: DateValidator,
    lastUpdatedAt: DateValidator,
    instances: z.number().nonnegative().default(0)
});

export const GroupQueryValidator = BaseQueryValidator.extend({
    sortBy: GroupValidator.keyof().optional().default('group')
});
