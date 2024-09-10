import { Inject, Injectable } from '@nestjs/common';
import { RabbitmqProviderType } from './rabbitmq.provider';
import { Channel, Message } from 'amqplib';

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
    this.makeAsserts(queue);
    this.channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
  }

  async publishInExchange(
    exchange: Exchange,
    routingKey: RoutingKey,
    message: string,
  ) {
    await this.start();

    const dlxExchange = 'dlx_exchange';
    const dlq = `dlq_${exchange}`;
    const dlqRoutingKey = 'dlq_key';

    this.channel.assertExchange(dlxExchange, 'direct', { durable: true });
    this.channel.assertQueue(dlq, { durable: true });
    this.channel.bindQueue(dlq, dlxExchange, dlqRoutingKey);

    this.channel.publish(exchange, routingKey, Buffer.from(message));
  }

  async consume(queue: Queue, callback?: (message: Message) => void) {
    await this.start();
    this.makeAsserts(queue);
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

  private makeAsserts(queue: Queue) {
    const dlxExchange = 'dlx_exchange';
    const dlq = `dlq_${queue}`;
    const dlqRoutingKey = 'dlq_key';

    this.channel.assertQueue(queue, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': dlxExchange,
        'x-dead-letter-routing-key': 'dlq_key',
        'x-message-ttl': 20000,
      },
    });
    this.channel.assertExchange(dlxExchange, 'direct', { durable: true });
    this.channel.assertQueue(dlq, { durable: true });
    this.channel.bindQueue(dlq, dlxExchange, dlqRoutingKey);
  }
}
