import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MailModule } from 'src/mail/mail.module';
import { TodoModule } from 'src/todo/todo.module';
import { PrismaModule } from 'prisma/prisma.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    AuthModule,
    MailModule,
    TodoModule,
    PrismaModule,
    NotificationModule,
    EventEmitterModule.forRoot({ global: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
