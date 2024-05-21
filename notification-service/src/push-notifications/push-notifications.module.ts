import { Module } from '@nestjs/common';
import { PushNotificationsService } from './push-notifications.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [PushNotificationsService],
})
export class PushNotificationsModule {}
