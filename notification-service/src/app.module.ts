import { Module } from '@nestjs/common';
import { PushNotificationsModule } from './push-notifications/push-notifications.module';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RabbitMQExchange } from './common/rabbitmq/rabbitmq.common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PushNotificationsModule,
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const rabbitMQHost = configService.get<string>('RABBITMQ_HOST');
        const rabbitMQPort = configService.get<number>('RABBITMQ_PORT');
        const rabbitMQUsername = configService.get<string>('RABBITMQ_USERNAME');
        const rabbitMQPassword = configService.get<string>('RABBITMQ_PASSWORD');
        const uri = `amqp://${rabbitMQPassword}:${rabbitMQUsername}@${rabbitMQHost}:${rabbitMQPort}`;
        return {
          connectionInitOptions: {
            timeout: 60000
          },
          exchanges: [
            {
              name: RabbitMQExchange.USER_SIGNUP_NOTIFICATION,              
              type: 'x-delayed-message',
              options: {
                arguments: {
                  'x-delayed-type': 'direct',
                },
              },
            },
          ],
          uri,
        };
      },
    }),
  ],
})
export class AppModule {}
