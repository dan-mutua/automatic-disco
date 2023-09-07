import {
  Body,
  Controller,
  Get,
  Inject,
  Injectable,
  Param,
  Post,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { MailerService } from '@nestjs-modules/mailer';
import { User, countryCode } from 'src/users/entities/user.entity';

@Controller('notifications')
@Injectable()
export class NotificationController {
  constructor(
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationService: NotificationService,
    private readonly mailerService: MailerService,
  ) {}

  @Post()
  async createNotification(
    @Body()
    notification: {
      title: string;
      message: string;
      roleFilter?: string;
      countryFilter?: countryCode;
    },
  ): Promise<void> {
    await this.notificationService.createNotification(
      notification.title,
      notification.message,
      notification.roleFilter,
      notification.countryFilter,
    );
  }

  // @Get()
  // async findAllNotifications(): Promise<Notification[]> {
  //   return await this.notificationService.findAllNotifications();
  // }

  @Get('users/:role/:country')
  async getUsersByRoleAndCountry(
    @Param('role') role: string,
    @Param('country') country: string,
  ): Promise<User[]> {
    return await this.notificationService.getUsersByRoleAndCountry(
      role,
      country,
    );
  }
}
