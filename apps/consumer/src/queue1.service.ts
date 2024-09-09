import { Controller, OnModuleInit } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq/rabbitmq.service';
import { publicDecrypt } from 'crypto';
import { log } from 'console';

@Controller()
export class Queue1Service implements OnModuleInit {
  constructor(public readonly rabbitmqService: RabbitmqService) {}

  async handler() {
    await this.rabbitmqService.consume('q1', (message) => {
      console.log(message.content.toString());
    });
  }

  onModuleInit() {
    this.handler();
  }
}
