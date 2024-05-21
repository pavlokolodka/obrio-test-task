import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,
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
          uri,
        };
      },
    }),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
