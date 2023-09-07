import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { SwaggerModule } from '@nestjs/swagger';
import { DocumentsMModule } from './documents-m/documents-m.module';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import { BullModule } from '@nestjs/bull';
import { NotificationQueueService } from './notifications/notification.queue';
import { NotificationWorker } from './notifications/notification.worker';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    SwaggerModule,
    DocumentsMModule,
    AuthModule,
    NotificationsModule,
    BullModule.registerQueue({
      name: 'notifications',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, NotificationQueueService, NotificationWorker],
})
export class AppModule {}
