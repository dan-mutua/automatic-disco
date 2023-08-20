import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './services/users.service';
import { UserController } from './users.controller';
import { PassportModule } from '@nestjs/passport';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { usersProviders } from './users.providers';
import { MailService } from 'src/mail/mail.service';
import { MailModule } from 'src/mail/mail.module';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MailModule,
    ConfigModule,
  ],
  controllers: [UserController],

  providers: [UserService, ...usersProviders, MailService],
  exports: [UserService],
})
export class UsersModule {}
