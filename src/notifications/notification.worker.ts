// notification.worker.ts

import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
import { Notification } from './notification.entity';

@Processor('notifications')
export class NotificationWorker {
  private readonly logger = new Logger(NotificationWorker.name);

  constructor(private readonly mailerService: MailerService) {}

  @Process('sendNotification')
  async sendNotification(job: Job<Notification>): Promise<void> {
    try {
      const notification = job.data;
      const { receiver, title, message } = notification;

      await this.mailerService.sendMail({
        to: receiver,
        subject: title,
        text: message,
      });

      this.logger.log(`Email notification sent to ${receiver}`);
    } catch (error) {
      this.logger.error('Error sending email:', error);
    }
  }
}
