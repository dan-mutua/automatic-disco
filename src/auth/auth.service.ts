import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/services/users.service';
import { MailService } from '../mail/mail.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private readonly tokenBlacklist: Set<string> = new Set();
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.userService.findOneByEmail(username);
    if (!user) {
      return null;
    }

    const match = await this.comparePassword(pass, user.password);

    if (!match) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  public async login(user) {
    const token = await this.generateToken(user);
    const encodedToken = Buffer.from(token).toString('base64');
    return { user, token: encodedToken };
  }

  async getCurrentUser(token: string) {
    try {
      const decodedToken = await this.jwtService.verifyAsync(token);
      const user = await this.userService.findOneByEmail(decodedToken.email);
      return user;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  public async create(user) {
    const newUser = await this.userService.create(user);

    const token = await this.generateToken(Object.assign({}, newUser));
    const encodedToken = Buffer.from(token).toString('base64');

    return { user: newUser, token: encodedToken };
  }

  private async generateToken(user) {
    const token = await this.jwtService.signAsync(user);
    return token;
  }

  private async hashPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  private async comparePassword(enteredPassword, dbPassword) {
    const match = await bcrypt.compare(enteredPassword, dbPassword);
    return match;
  }

  public async logout(token: string) {
    try {
      const decodedToken = await this.jwtService.verifyAsync(token);
      this.tokenBlacklist.add(decodedToken.jti);
      return { message: 'Logout successful' };
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetToken = uuidv4();
    const resetLink = `https://example.com/reset-password/${resetToken}`;
    user.passwordResetCode = resetToken;
    await this.userService.create(user);

    const { name } = user;
    await this.mailService.sendPasswordResetEmail(email, name, resetLink);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userService.findOneByResetToken(token);
    if (!user) {
      throw new NotFoundException('Invalid reset token');
    }

    user.password = newPassword;
    user.passwordResetCode = null;
    await this.userService.create(user);
  }
}
