import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { countryCode } from '../users/entities/user.entity';

export class CreateNotificationDto {
  @ApiProperty({
    example: 'Notification Title',
    description: 'The title of the notification',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Notification Message',
    description: 'The message of the notification',
  })
  @IsString()
  message: string;

  @ApiProperty({
    example: 'admin',
    description: 'Filter notifications by user role (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  roleFilter?: string | null;

  @ApiProperty({
    example: 'US',
    description: 'Filter notifications by country code (optional)',
    required: false,
  })
  @IsOptional()
  @IsEnum(countryCode)
  countryFilter?: countryCode | null;
}
