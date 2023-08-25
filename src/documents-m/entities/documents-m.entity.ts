import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

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
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  documentName: string;

  @Column()
  documentType: docType;

  @Column()
  documentSrc: string;

  @Column()
  userId: number | string;

  @Column()
  status: boolean;

  @Column()
  dateCreated: Date;

  @Column()
  country: countryCode;

  @Column(() => User)
  user: User;
}
