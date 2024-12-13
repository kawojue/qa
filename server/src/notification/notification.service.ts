import { Injectable } from '@nestjs/common';
import { loadTemplate, render } from './render';
import { MailService } from 'src/mail/mail.service';
import { CreateEmailNotificationEvent } from './notification.event';

@Injectable()
export class NotificationService {
  constructor(private readonly mail: MailService) {}

  async sendEmailNotification(event: CreateEmailNotificationEvent) {
    const template = event?.dynamic
      ? event.template
      : loadTemplate(event.template);

    const html = event?.dynamic ? event.template : render(template, event.data);

    await this.mail.sendResendEmail({
      html,
      to: event.emails,
      from: event.from,
      subject: event.subject,
    });
  }
}
