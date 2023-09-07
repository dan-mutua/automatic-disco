import { Connection } from 'typeorm';
import { NotificationService } from './notification.service';
import { Notification } from './notification.entity';

export const notificationProviders = [
  NotificationService,
  {
    provide: 'NOTIFICATION_REPOSITORY',
    useFactory: (connection: Connection) =>
      connection.getRepository(Notification),
    inject: ['DATABASE_CONNECTION'],
  },
];
