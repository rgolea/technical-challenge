import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Schema } from 'zod';

@Injectable()
export class ZodValidationInterceptor implements NestInterceptor {
  constructor(private schema: Schema) {}
  intercept(_: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(map((result) => this.schema.parse(result)));
  }
}
