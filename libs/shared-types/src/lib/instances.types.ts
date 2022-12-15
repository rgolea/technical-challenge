import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";
import { InstanceValidator, ParametersValidator, RegisterValidator, InstanceMetaValidator, InstanceQueryValidator } from "@technical-challenge/validators";
import { Query } from "./query.types";

export type Register = z.infer<typeof RegisterValidator>;
export type Instance = z.infer<typeof InstanceValidator>;
export type InstanceQuery = Query<Instance>;

// export type Parameters = z.infer<typeof ParametersValidator>;
export class ParametersDTO extends createZodDto(ParametersValidator) {}
export class RegisterDTO extends createZodDto(InstanceMetaValidator) {}
export class InstanceQueryDTO extends createZodDto(InstanceQueryValidator.extend({ sortBy: InstanceValidator.keyof().optional() })){}
