import { z } from "zod";

export const GroupIDValidator = z.string().max(50).regex(/^(?!instances$|count$).*/);


// Regex to match everything but the words "instances" or "count" as it's being used as a reserved word
/*
- ^ matches the beginning of the string
- (?!) matches the following expression only if it is not followed by the expression in the parentheses
- instances matches the characters instances literally (case sensitive)
- $ matches the end of the string
*/
