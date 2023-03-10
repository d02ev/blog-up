import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as DotEnv from 'dotenv';

DotEnv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  await app.listen(process.env.PORT);
}
bootstrap();
