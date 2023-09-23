import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { notificationProviders } from './notification.provider';
import { NotificationController } from './notification.controller';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';

@Global()
@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot(),

    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        secure: false,
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.EMAIL_PASS,
        },
      },
      defaults: {
        from: '"No Reply" noreply@gmail.com',
      },
      template: {
        dir: join(__dirname, '../views/email-templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),

    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  controllers: [NotificationController],

  providers: [...notificationProviders],
  exports: [...notificationProviders],
})
export class NotificationsModule {}
