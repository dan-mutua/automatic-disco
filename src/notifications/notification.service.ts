import { Inject, Injectable } from '@nestjs/common';
import { Notification } from './notification.entity';
import { User, countryCode } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
// import { BullMQ } from 'bull';
import { NotificationQueueService } from './notification.queue';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('NOTIFICATION_REPOSITORY')
    private notificationRepository: Repository<Notification>,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
    private readonly mailerService: MailerService,
    // private readonly bull: BullMQ,
    private readonly notificationQueueService: NotificationQueueService,
  ) {}

  async createNotification(
    title: string,
    message: string,
    roleFilter: string | null = null,
    countryFilter: countryCode | null = null,
  ): Promise<void> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (roleFilter) {
      queryBuilder.where('user.role = :role', { role: roleFilter });
    }

    if (countryFilter) {
      queryBuilder.andWhere('user.countryCode = :countryCode', {
        countryCode: countryFilter,
      });
    }

    const usersToNotify = await queryBuilder.getMany();

    const notifications: Notification[] = usersToNotify.map((user) => {
      const notification = new Notification();
      notification.title = title;
      notification.message = message;
      notification.receiver = user.email;
      /// add to queue
      this.notificationQueueService.addNotificationToQueue(notification);

      this.sendEmailNotification(notification, user);
      return notification;
    });

    return;
  }
  async findAllNotifications(): Promise<Notification[]> {
    return await this.notificationRepository.find();
  }

  async generateNotificationReport(): Promise<string> {
    try {
      const notifications = await this.notificationRepository.find();

      // Create a report
      let report = `Notification Report (${new Date().toLocaleString()}):\n\n`;
      notifications.forEach((notification, index) => {
        report += `Notification ${index + 1}:\n`;
        report += `Title: ${notification.title}\n`;
        report += `Message: ${notification.message}\n`;
        report += `Receiver: ${notification.receiver}\n`;
        report += '-----------------\n';
      });

      // You can log the report or save it to a file
      // For now, let's just return it as a string
      return report;
    } catch (error) {
      console.error('Error generating notification report:', error);
      throw error;
    }
  }

  async sendEmailNotification(
    notification: Notification,
    receiverUser: User,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: receiverUser.email,
        subject: notification.title,
        text: notification.message,
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
