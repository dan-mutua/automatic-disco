import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from './services/users.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ApiTags, ApiResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { Scout } from 'src/scout/entities/scout.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ScoutService } from 'src/scout/scout.service';
import { MailService } from '../mail/mail.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly scoutService: ScoutService,
    private readonly mailService: MailService,
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Returns an array of users',
    type: [User],
  })
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'get all users',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(+id);
  }

  @Post()
  @ApiResponse({
    status: 200,
    description: 'Created a new user',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  // async create(@Body() user: User): Promise<User> {

  //   const confirmationLink = `https://example.com/confirm-email?code=${newUser.emailAddressVerificationCode}`; //todo

  //   await this.mailService.sendConfirmationEmail(
  //     user.email,
  //     user.name,
  //     confirmationLink,
  //   );
  //   return this.userService.create(user);
  // }
  async create(@Body() user: User): Promise<User> {
    try {
      const newUser = await this.userService.create(user);
      const confirmationLink = `https://example.com/confirm-email?code=${newUser.emailAddressVerificationCode}`; //to do
      await this.mailService.sendConfirmationEmail(
        newUser.email,
        newUser.name,
        confirmationLink,
      );
      return newUser;
    } catch (error) {
      if (error instanceof ConflictException) {
        console.log(error.message);
        throw new ConflictException('Email address is already in use ccc');
      } else {
        throw new InternalServerErrorException('Error creating user');
      }
    }
  }

  @Put(':id')
  @ApiResponse({
    status: 204,
    description: 'update user',
    type: User,
  })
  async update(@Param('id') id: string, @Body() user: User): Promise<User> {
    return this.userService.update(+id, user);
  }

  @Delete(':id')
  @ApiResponse({
    status: 204,
    description: ' user deleted succesfully',
    type: User,
  })
  // async remove(@Param('id') id: string): Promise<void> {
  //   return this.userService.remove(+id);
  // }
  async deleteUser(@Param('id') id: any) {
    try {
      await this.userService.remove(id);
      return { message: 'User deleted successfully' };
    } catch (e) {
      if (e.name === 'ForeignKeyConstraintError') {
        // Delete related scouts first
        // Try to delete user again
        await this.scoutService.deleteScoutByUserId(id);
        await this.userService.remove(id);
        return { message: 'User and related scouts deleted successfully' };
      } else {
        throw e;
      }
    }
  }
}
