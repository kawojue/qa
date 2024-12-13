import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from './notification.service';
import { CreateEmailNotificationEvent } from './notification.event';

@Injectable()
export class NotificationListener {
  constructor(private service: NotificationService) {}

  @OnEvent('notification.email')
  async sendEmail(event: CreateEmailNotificationEvent) {
    await this.service.sendEmailNotification(event);
  }
}
