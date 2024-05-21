import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { CreateNotificationDto } from '../common/shared/create-notification.dto';
import {
  RabbitMQExchange,
  RabbitMQQueue,
  RabbitMQRoutingKey,
} from '../common/rabbitmq/rabbitmq.common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PushNotificationsService {
  private readonly logger = new Logger(PushNotificationsService.name);

  constructor(private configService: ConfigService) {}

  @RabbitSubscribe({
    exchange: RabbitMQExchange.USER_SIGNUP_NOTIFICATION,
    routingKey: RabbitMQRoutingKey.SEND_SIGNUP_NOTIFICATION,
    queue: RabbitMQQueue.SEND_SIGNUP_NOTIFICATION,
  })
  public async sendSignupNotification(msg: CreateNotificationDto) {
    const webhookURL = this.configService.get<string>('WEBHOOK_URL');
    this.logger.log(`Sending notification: ${JSON.stringify(msg)}`);
    const response = await fetch(webhookURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: msg.userId,
        message: `Thank you for registering for our service, ${msg.userName}!`,
      }),
    });

    if (!response.ok) {
      this.logger.error(`Failed to send notification: ${response.status}`);
    }
  }
}
