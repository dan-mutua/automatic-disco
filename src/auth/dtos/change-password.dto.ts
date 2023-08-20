import { IsString, MinLength, IsEmail } from 'class-validator';

export class ChangePasswordDto {
  @IsString({
    message: 'should be string',
  })
  @MinLength(6, {
    message: 'should have minimum of 6 characters',
  })
  password: string;

  @IsString({
    message: 'should be a string',
  })
  @MinLength(6, {
    message: 'password should have minimum of 6 characters',
  })
  passwordConfirmation: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}
