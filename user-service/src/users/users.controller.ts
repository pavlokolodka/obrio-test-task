import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { CreateNotificationDto } from '../common/shared/create-notification.dto';
import {
  RabbitMQExchange,
  RabbitMQRoutingKey,
} from '../common/rabbitmq/rabbitmq.common';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly amqpConnection: AmqpConnection,
    private configService: ConfigService,
  ) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    const user = await this.usersService.createUser(dto);
    const delayInMilliseconds =
      this.configService.get<number>('DELAY_IN_MILLISECONDS') ||
      1000 * 60 * 60 * 24;

    await this.amqpConnection.publish<CreateNotificationDto>(
      RabbitMQExchange.USER_SIGNUP_NOTIFICATION,
      RabbitMQRoutingKey.SEND_SIGNUP_NOTIFICATION,
      { userId: user.id, userName: user.name },
      {
        headers: {
          'x-delay': delayInMilliseconds,
        },
      },
    );
    return user;
  }
}
