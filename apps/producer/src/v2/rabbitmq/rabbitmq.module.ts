import { DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ClientProviderOptions,
  ClientsModule,
  ClientsProviderAsyncOptions,
  Transport,
} from '@nestjs/microservices';

export type QueueConfig = {
  providerName: string;
  queue: string;
};

export class RabbitmqModule {
  private static toQueue(
    providerName: string,
    queue: string,
    url: string = 'amqp://admin:admin@rabbitmq:5672',
  ): ClientProviderOptions {
    return {
      name: providerName,
      transport: Transport.RMQ,
      options: {
        urls: [url],
        queue,
      },
    };
  }

  static forQueue(queueConfig: QueueConfig[]): DynamicModule {
    const providers: ClientProviderOptions[] = [];
    for (const config of queueConfig) {
      providers.push(RabbitmqModule.toQueue(config.providerName, config.queue));
    }

    return {
      module: RabbitmqModule,
      global: true,
      imports: [ClientsModule.register(providers)],
      exports: [ClientsModule],
    };
  }

  static forQueueAsync(queueConfig: QueueConfig[]): DynamicModule {
    const providers: ClientsProviderAsyncOptions[] = [];
    for (const config of queueConfig) {
      providers.push({
        name: config.providerName,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
          return RabbitmqModule.toQueue(config.providerName, config.queue);
        },
      });
    }

    return ClientsModule.registerAsync(providers);
  }
}
