import { Module } from '@nestjs/common';
import { Queue1Service } from './queue1.service';
import { RabbitmqService } from './rabbitmq/rabbitmq.service';
import { ConfigModule } from '@nestjs/config';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { RabbitmqProvider } from './rabbitmq/rabbitmq.provider';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), RabbitmqModule],
  controllers: [Queue1Service],
  providers: [RabbitmqService, RabbitmqProvider],
})
export class ConsumerModule {}
