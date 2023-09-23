import { Controller, Get, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Notification } from './notification.entity';
import { CreateNotificationDto } from './create-notification.dto'; // You need to create this DTO

// Import decorators from @nestjs/swagger
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiCreatedResponse,
} from '@nestjs/swagger';

@Controller('notifications')
@ApiTags('Notifications') // Add a tag for your controller
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a notification' })
  @ApiCreatedResponse({
    description: 'The notification has been successfully created.',
  })
  async createNotification(
    @Body() createNotificationDto: CreateNotificationDto,
  ): Promise<void> {
    const { title, message, roleFilter, countryFilter } = createNotificationDto;

    await this.notificationService.createNotification(
      title,
      message,
      roleFilter,
      countryFilter,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiResponse({ status: 200, description: 'Returns all notifications.' })
  async findAllNotifications(): Promise<Notification[]> {
    return this.notificationService.findAllNotifications();
  }

  @Get('report')
  @ApiOperation({ summary: 'Generate a notification report' })
  @ApiResponse({
    status: 200,
    description: 'Returns a notification report as a string.',
  })
  async generateNotificationReport(): Promise<string> {
    return this.notificationService.generateNotificationReport();
  }
}
