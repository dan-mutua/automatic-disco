import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  UseGuards,
  Req,
  Param,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { GetUser } from './decorators/get-user.decorator';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { CredentialsDto } from 'src/users/dtos/credentials.dto';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { LocalAuthGuard } from './localAuth.guard';
import { JwtAuthGuard } from './jwtAuth.guard';
import { UserService } from 'src/users/services/users.service';
import { AuthGuard } from '@nestjs/passport';
import { ForgotPasswordDto } from './dtos/change-password.dto';

@Controller('auth')
@ApiTags('authentication')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('/signup')
  @ApiResponse({ status: 201, description: 'Successful Registration' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async signUp(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<{ message: string }> {
    await this.authService.create(createUserDto);

    return {
      message: 'yeeeeyyyy  Successfully registered',
    };
  }

  @Post('/signin')
  @ApiBody({ type: [CredentialsDto] })
  @ApiResponse({ status: 201, description: 'Successful Login' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(LocalAuthGuard)
  async signIn(@Req() req: any): Promise<{ token: string }> {
    const user = {
      sub: req.user.id, // this is the most important
      id: req.user.id,
      ...req.user,
    };

    return await this.authService.login(user);
  }

  @Get('/me')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: String, example: '1' })
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req): Promise<User | null> {
    return this.userService.findOne(req.user.id);
  }
  // async getCurrentUser(@Req() req) {
  //   const user = await this.authService.getCurrentUser(
  //     req.headers.authorization,
  //   );
  //   return user;
  // }

  @Post('logout')
  async logout(@Body() body) {
    const { token } = body;
    const result = await this.authService.logout(token);
    return result;
  }

  @Post('/forgot-password')
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<void> {
    await this.authService.sendPasswordResetEmail(forgotPasswordDto.email);
  }

  // @Post('/reset-password/:token')
  // @ApiParam({ name: 'token', type: String, example: 'reset-token' })
  // @ApiBody({ type: ResetPasswordDto })
  // @ApiResponse({ status: 200, description: 'Password reset successful' })
  // @ApiResponse({ status: 400, description: 'Bad Request' })
  // async resetPassword(
  //   @Param('token') token: string,
  //   @Body() resetPasswordDto: ResetPasswordDto,
  // ): Promise<{ message: string }> {
  //   await this.passwordResetService.resetPassword(
  //     token,
  //     resetPasswordDto.password,
  //   );
  //   return { message: 'Password reset successful' };
  // }
}
