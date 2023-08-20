import {
  Controller,
  Get,
  Post,
  Render,
  Res,
  Body,
  HttpStatus,
  Req,
  Param,
} from '@nestjs/common';
import { UserService } from './services/users.service';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Get()
  @Render('index')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  root() {}

  @Get('/verify')
  @Render('verify')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  VarifyEmail() {}

  @Post('/signup')
  async Signup(@Body() user: User) {
    return await this.userService.signup(user);
  }

  @Post('/signin')
  async Signin(@Body() user: User) {
    return await this.userService.signin(user, this.jwtService);
  }

  @Post('/verify')
  async Varify(@Body() body) {
    return await this.userService.verifyAccount(body.code);
  }

  @Get('/:id')
  async getOneUser(@Res() response, @Param() param) {
    const user = await this.userService.getOne(param.id);
    return response.status(HttpStatus.CREATED).json({
      user,
    });
  }
}
