import { z } from "zod";

const CursorValidator = z.union([z.coerce.date(), z.string(), z.any()]).optional();

export const BaseQueryValidator = z.object({
    limit: z.coerce.number().int().nonnegative().optional(),
    after: CursorValidator,
    before: CursorValidator,
    sort: z.enum(['asc', 'desc']).optional(),
});
