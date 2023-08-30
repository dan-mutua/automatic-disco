import { ApiProperty } from '@nestjs/swagger';
import { countryCode } from '.././entities/documents-m.entity';
import { docType } from '.././entities/documents-m.entity';
import { User } from '../../users/entities/user.entity';

export class QueryStringParams {
  @ApiProperty({ required: false })
  id?: number;

  @ApiProperty({ required: false })
  documentName?: string;

  @ApiProperty({ required: false })
  documentType?: docType;

  @ApiProperty({ required: false })
  documentSrc?: string;

  @ApiProperty({ required: false })
  userId?: number | string;

  @ApiProperty({ required: false })
  status?: boolean;

  @ApiProperty({ required: false })
  country?: countryCode;

  @ApiProperty({ required: false })
  user?: User;

  @ApiProperty({ required: false })
  createdAt?: Date;

  @ApiProperty({ required: false })
  updatedAt?: Date;
}
