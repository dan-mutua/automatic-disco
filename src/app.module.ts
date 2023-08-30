import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { SwaggerModule } from '@nestjs/swagger';
import { DocumentsMModule } from './documents-m/documents-m.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    SwaggerModule,
    DocumentsMModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
