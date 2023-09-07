import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class NotificationQueueService {
  constructor(@InjectQueue('notifications') private readonly queue: Queue) {}

  async addNotificationToQueue(notificationData: any): Promise<void> {
    await this.queue.add('sendNotification', notificationData);
  }
}

//This service is responsible for adding notifications to the queue.
