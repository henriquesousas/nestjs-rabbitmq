import { Controller, Get } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq/rabbitmq.service';

@Controller()
export class ProducerController {
  constructor(private readonly rabbitmqService: RabbitmqService) {}

  @Get('queue')
  async sendToQueue() {
    const data = { message: 'ok' };
    this.rabbitmqService.publishInQueue('q1', JSON.stringify(data));
    return data;
  }

  @Get('exchange')
  async sendToExchange() {
    const data = { message: 'ok' };
    this.rabbitmqService.publishInExchange(
      'amq.direct',
      'q1-q2-key',
      JSON.stringify(data),
    );
    return data;
  }
}
