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

  async getUsersByRoleAndCountry(
    role: string,
    country: string,
  ): Promise<User[]> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.role = :role', { role })
      .andWhere('user.country = :country', { country })
      .getMany();

    return users;
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
  // async sendEmailNotification(
  //   notification: Notification,
  //   receiverUser: User,
  // ): Promise<void> {
  //   try {
  //     await this.mailerService.sendMail({
  //       to: receiverUser.email,
  //       subject: notification.title,
  //       text: notification.message,
  //     });
  //      await this.notificationRepository.update({
  //        id: notification.id,
  //        sent: true,
  //      });

  //   } catch (error) {
  //     console.error('Error sending email:', error);
  //   }
  // }
}
