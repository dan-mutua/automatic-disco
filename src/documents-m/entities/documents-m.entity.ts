import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

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
  status: boolean;

  @Column({ type: 'timestamp', nullable: false, default: () => 'now()' })
  @ApiProperty({ example: '2023-02-21T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty()
  @Column({ nullable: true })
  country: countryCode;

  // @ApiProperty()
  // @IsOptional()
  // @Column(() => User)
  // user: User['id'];

  @ApiProperty()
  @IsInt()
  @Column({ nullable: true })
  userAccountId: number;
  @ManyToOne(() => User, { cascade: true })
  @JoinColumn({ name: 'userAccountId' })
  user: User;
}
