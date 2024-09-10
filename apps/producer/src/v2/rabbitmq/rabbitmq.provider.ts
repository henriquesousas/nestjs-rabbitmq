import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

export type MyMessage = {
  message: string;
};

@Injectable()
export class RabbitmqProvider {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://admin:admin@rabbitmq:5672'],
        queue: 'q1',
        queueOptions: {
          durable: true,
        },
      },
    });
  }

  async emit(topic: string, message: MyMessage) {
    return this.client.emit(topic, message);
  }
}
