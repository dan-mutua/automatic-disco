import { Connection } from 'typeorm';
import { NotificationService } from './notification.service';
import { Notification } from './notification.entity';
import { NotificationQueueService } from './notification.queue';

export const notificationProviders = [
  NotificationService,
  NotificationQueueService,
  {
    provide: 'NOTIFICATION_REPOSITORY',
    useFactory: (connection: Connection) =>
      connection.getRepository(Notification),
    inject: ['DATABASE_CONNECTION'],
  },
];
