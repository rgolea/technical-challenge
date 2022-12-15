import { z } from "zod";

export const CountValidator = z.object({
    estimatedDocumentCount: z.number().int().nonnegative(),
    count: z.number().int().nonnegative(),
});
