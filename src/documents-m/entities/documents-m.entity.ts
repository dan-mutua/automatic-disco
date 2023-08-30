import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum countryCode {
  KE = 'Kenya',
  TZ = 'Tanzania',
  RWA = 'Rwanda',
  UG = 'Uganda',
}

export enum docType {
  addenum = 'addenum',
  pra = 'pra',
  sps_trade_doc = 'sps_trade_doc',
}

@Entity()
export class DocumentsM {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  documentName: string;

  @ApiProperty()
  @Column()
  documentType: docType;

  @ApiProperty()
  @Column()
  documentSrc: string;

  @ApiProperty()
  @Column()
  userId: number | string;

  @ApiProperty()
  @Column()
  status: boolean;

  @ApiProperty()
  @Column()
  dateCreated: Date;

  @ApiProperty()
  @Column()
  country: countryCode;

  @ApiProperty()
  @Column(() => User)
  user: User;
}
