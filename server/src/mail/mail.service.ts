import { Injectable } from '@nestjs/common';
import { config } from 'configs/env.config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class MailService {
  constructor(private httpService: HttpService) {}

  async sendResendEmail({ subject, to, html }: EmailConfig) {
    await lastValueFrom(
      this.httpService.post(
        'https://api.useplunk.com/v1/send',
        {
          to,
          subject,
          body: html,
        },
        {
          headers: {
            Authorization: `Bearer ${config.plunk.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      ),
    );
  }
}
