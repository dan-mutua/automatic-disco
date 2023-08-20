import { EntityRepository, Repository } from 'typeorm';
import { User } from './entities/user.entity';

import { UserRole } from './user-roles.enum';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserStatus } from './user-status.enum';
import { CreateUserDto } from './dtos/create-user.dto';
import { CredentialsDto } from './dtos/credentials.dto';
import { GetAllUsersDto } from './dtos/get-users.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  // async getUsers(filterDto: GetAllUsersDto): Promise<User[]> {
  //   const query = this.createQueryBuilder('user');

  //   const users = await query.getMany();
  //   return users;
  // }


  // async checkCredentials(credentialsDto: CredentialsDto): Promise<User> {
  //   const { email, password } = credentialsDto;
  //   const user = await this.findOne({ email });

  //   if (user && (await user.checkPassword(password))) {
  //     return user;
  //   } else {
  //     return null;
  //   }
  // }

  // async changePassword(id: string, password: string) {
  //   const user = await this.findOne(id);
  //   user.salt = await bcrypt.genSalt();
  //   user.password = await this.hashPassword(password, user.salt);
  //   user.passwordResetCode = null;
  //   await user.save();
  // }

}
