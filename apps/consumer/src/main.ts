import { NestFactory } from '@nestjs/core';
import { ConsumerModule } from './consumer.module';

async function bootstrap() {
  const app = await NestFactory.create(ConsumerModule);
  await app.init();
}
bootstrap();
