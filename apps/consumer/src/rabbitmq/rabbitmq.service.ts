import { Inject, Injectable } from '@nestjs/common';
import { Channel, Message } from 'amqplib';
import { RabbitmqProviderType } from './rabbitmq.provider';

export type Queue = 'q1' | 'q2' | 'q1-dlq';
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

  async consume(queue: Queue, callback?: (message: Message) => void) {
    await this.start();

    const dlxExchange = 'dlx_exchange';
    const dlq = `dlq_${queue}`;
    const dlqRoutingKey = 'dlq_key';

    this.channel.assertQueue(queue, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': dlxExchange,
        'x-dead-letter-routing-key': dlqRoutingKey,
        'x-message-ttl': 20000,
      },
    });

    this.channel.assertQueue(dlq, { durable: true });

    return this.channel.consume(
      queue,
      (message) => {
        if (callback) {
          callback(message);
        }
        // this.channel.nack(message, false, false); //rejeita
        this.channel.nack(message, false, true); //reprocessa
        // channel.ack(msg); //ready ok
      },
      { noAck: false },
    );
  }
}
