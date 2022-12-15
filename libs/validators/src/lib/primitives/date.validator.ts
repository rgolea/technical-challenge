import { z } from "zod";

export const DateValidator = z.union([z.date().transform(date => date.toISOString()).pipe(z.string().datetime()), z.string().datetime(), z.number().transform((n) => new Date(n).toISOString()).pipe(z.string().datetime())]);
