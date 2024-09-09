import { Module } from '@nestjs/common';
import { ProducerController } from './producer.controller';
import { ProducerService } from './producer.service';
import { ConfigModule } from '@nestjs/config';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { RabbitmqProvider } from './rabbitmq/rabbitmq.provider';
import { RabbitmqService } from './rabbitmq/rabbitmq.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), RabbitmqModule],
  controllers: [ProducerController],
  providers: [RabbitmqService, RabbitmqProvider],
  exports: [RabbitmqProvider],
})
export class ProducerModule {}
