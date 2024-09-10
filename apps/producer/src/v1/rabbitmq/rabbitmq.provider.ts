import { ConfigService } from '@nestjs/config';
import { connect, Channel } from 'amqplib';

export const RabbitmqProvider = {
  provide: 'RABBITMQ_PROVIDER',
  useFactory: async (configService: ConfigService) => {
    const uri = configService.get<string>('RABBITMQ_URI');

    const conn = await connect(uri);

    conn.on('connect', () => {
      console.log('Connected on RabbitMQ');
    });

    conn.on('connectFailed', () => {
      console.log('Failure to connected on RabbitMQ');
    });

    const chanell = await conn.createChannel();
    return chanell;
  },
  inject: [ConfigService],
};

export type RabbitmqProviderType = Promise<Channel>;
