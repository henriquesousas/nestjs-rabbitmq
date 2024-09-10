import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('v2')
export class ProducerController {
  constructor(@Inject('QUEUE1') private rabbitmqClient: ClientProxy) {}

  @Get('queue')
  async sendToQueue() {
    const data = { message: 'ok' };
    this.rabbitmqClient.emit('q1', JSON.stringify(data));
    return data;
  }
}
