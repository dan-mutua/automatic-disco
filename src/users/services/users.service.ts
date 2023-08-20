import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { USER_REPOSITORY } from '../index';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserRole } from '../user-roles.enum';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
    private readonly mailService: MailService,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  async create(user: User): Promise<User> {
    const newUser = new User();

    for (const prop in user) {
      if (
        Object.prototype.hasOwnProperty.call(user, prop) &&
        user[prop] &&
        prop != 'id'
      ) {
        newUser[prop] = user[prop];
      }
    }

    newUser.role = UserRole[user.role || 'USER'];
    newUser.emailAddressVerificationCode = crypto
      .randomBytes(32)
      .toString('hex');
    newUser.salt = await bcrypt.genSalt();
    newUser.password = await bcrypt.hash(user.password, newUser.salt);

    const confirmationLink = `https://example.com/confirm-email?code=${newUser.emailAddressVerificationCode}`;
    await this.mailService.sendConfirmationEmail(
      newUser.email,
      newUser.name,
      confirmationLink,
    );

    try {
      await this.userRepository.insert(newUser);
      delete newUser.password;
      delete newUser.salt;
      return newUser;
    } catch (error) {
      if (error.code.toString() === '23505') {
        console.log(error.message);
        throw new ConflictException('Email address is already in use');
      } else {
        throw new InternalServerErrorException('Error saving user to database');
      }
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { email } });
  }

  async update(id: number, user: User): Promise<User> {
    const updatedUser = await this.userRepository.findOne(id);
    updatedUser.firstName = user.firstName;
    updatedUser.middleName = user.middleName;
    updatedUser.lastName = user.lastName;
    updatedUser.name = user.name;
    updatedUser.dateOfBirth = user.dateOfBirth;
    updatedUser.gender = user.gender;
    updatedUser.phone = user.phone;
    updatedUser.username = user.username;
    updatedUser.email = user.email;
    updatedUser.password = user.password;
    updatedUser.passwordResetCode = user.passwordResetCode;
    updatedUser.passwordResetLink = user.passwordResetLink;
    updatedUser.passwordResetTime = user.passwordResetTime;
    updatedUser.passwordChangedTime = user.passwordChangedTime;
    updatedUser.securityPin = user.securityPin;
    updatedUser.emailAddressVerificationCode =
      user.emailAddressVerificationCode;
    updatedUser.phoneNumberVerificationCode = user.phoneNumberVerificationCode;
    updatedUser.countryCode = user.countryCode;
    updatedUser.countryName = user.countryName;
    updatedUser.timezoneName = user.timezoneName;
    updatedUser.timezoneOffsetSeconds = user.timezoneOffsetSeconds;
    updatedUser.lastSeenTime = user.lastSeenTime;
    updatedUser.lastLoginTime = user.lastLoginTime;
    updatedUser.role = user.role;
    updatedUser.status = user.status;

    return await this.userRepository.save(updatedUser);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findOneByResetToken(token: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      passwordResetCode: token,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
