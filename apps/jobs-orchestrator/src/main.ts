/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { environment } from './environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(environment.PORT);
  Logger.log(
    `🚀 Application is running on: http://localhost:${environment.PORT}`
  );
}

bootstrap();
