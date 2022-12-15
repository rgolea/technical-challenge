import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { environment } from './environment';

import { AppModule } from './app/app.module';
const { PORT, ENDPOINT_PREFIX } = environment;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(ENDPOINT_PREFIX);
  await app.listen(PORT);
  Logger.log(
    `🚀 Application is running on: http://localhost:${PORT}/${ENDPOINT_PREFIX}`
  );
}

bootstrap();
