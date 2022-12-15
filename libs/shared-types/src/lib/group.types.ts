import { BaseQueryValidator, GroupValidator } from "@technical-challenge/validators";
import { z } from "zod";
import { createZodDto } from "@anatine/zod-nestjs";
import { Query } from "./query.types";

export type Group = z.infer<typeof GroupValidator>;
export type GroupQuery = Query<Group>;

export class GroupQueryDTO extends createZodDto(BaseQueryValidator.extend({ sortBy: GroupValidator.keyof().optional() })){}
