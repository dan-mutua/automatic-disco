import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { SwaggerModule } from '@nestjs/swagger';

@Module({
  imports: [UsersModule, DatabaseModule, SwaggerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
