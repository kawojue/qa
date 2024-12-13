import { HttpModule } from '@nestjs/axios';
import { MailService } from './mail.service';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [HttpModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
