import { ConfigService } from '@nestjs/config';
import { connect, Channel } from 'amqplib';

export const RabbitmqProvider = {
  provide: 'RABBITMQ_PROVIDER',
  useFactory: async (configService: ConfigService) => {
    const uri = configService.get<string>('RABBITMQ_URI');
    console.log(`Uri ${uri}`);

    const conn = await connect(uri);
    const chanell = await conn.createChannel();
    return chanell;
  },
  inject: [ConfigService],
};

export type RabbitmqProviderType = Promise<Channel>;
