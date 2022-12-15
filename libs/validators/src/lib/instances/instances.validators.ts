import { z } from 'zod';
import { DateValidator } from '../primitives/date.validator';
import { GroupIDValidator } from '../primitives/group-id.validator';
import { BaseQueryValidator } from '../queries/query';

export const InstanceMetaValidator = z.record(z.string(), z.any());



export const InstanceIDValidator = z.string().uuid();


export const InstanceValidator = z.object({
    id: InstanceIDValidator,
    group: GroupIDValidator,
    createdAt: DateValidator,
    lastUpdatedAt: DateValidator,
    meta: InstanceMetaValidator.optional(),
});

export const InstanceQueryValidator = BaseQueryValidator.extend({
    sortBy: InstanceValidator.keyof().optional().default('id')
});

export const RegisterValidator = InstanceValidator.omit({
    createdAt: true,
    lastUpdatedAt: true
});



export const ParametersValidator = z.object({
    group: GroupIDValidator,
    instance: InstanceIDValidator,
});
