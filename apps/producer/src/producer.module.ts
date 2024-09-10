import { Module } from '@nestjs/common';
import { ProducerController as ProducerControllerV2 } from './v2/producer.controller';
import { ConfigModule } from '@nestjs/config';
import { RabbitmqModule } from './v1/rabbitmq/rabbitmq.module';
import { RabbitmqModule as RabbitmqModuleV2 } from './v2/rabbitmq/rabbitmq.module';
import { RabbitmqProvider } from './v1/rabbitmq/rabbitmq.provider';
import { RabbitmqService } from './v1/rabbitmq/rabbitmq.service';
import { ProducerController } from './v1/producer.controller';

const queues = [
  {
    providerName: 'QUEUE1',
    queue: 'q1',
  },
  {
    providerName: 'QUEUE2',
    queue: 'q2',
  },
];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RabbitmqModule,
    RabbitmqModuleV2.forQueueAsync(queues),
  ],
  controllers: [ProducerController, ProducerControllerV2],
  providers: [RabbitmqService, RabbitmqProvider],
  exports: [RabbitmqProvider],
})
export class ProducerModule {}
