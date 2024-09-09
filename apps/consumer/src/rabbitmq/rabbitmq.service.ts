import { Inject, Injectable } from '@nestjs/common';
import { Channel, Message } from 'amqplib';
import { RabbitmqProviderType } from './rabbitmq.provider';

export type Queue = 'q1' | 'q2';
export type Exchange = 'amq.direct';
export type RoutingKey = 'q1-q2-key';

@Injectable()
export class RabbitmqService {
  private channel: Channel;

  constructor(
    @Inject('RABBITMQ_PROVIDER')
    private readonly rabbitmqProvider: RabbitmqProviderType,
  ) {}

  private async start() {
    if (!this.channel) {
      this.channel = await this.rabbitmqProvider;
    }
  }

  async publishInQueue(queue: Queue, message: string) {
    await this.start();
    this.channel.sendToQueue(queue, Buffer.from(message));
  }

  async publishInExchange(
    exchange: Exchange,
    routingKey: RoutingKey,
    message: string,
  ) {
    await this.start();
    this.channel.publish(exchange, routingKey, Buffer.from(message));
  }

  async consume(queue: Queue, callback?: (message: Message) => void) {
    await this.start();
    return this.channel.consume(queue, (message) => {
      if (callback) {
        callback(message);
      }
      this.channel.ack(message);
    });
  }
}
