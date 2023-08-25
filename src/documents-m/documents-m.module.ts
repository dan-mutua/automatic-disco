import { Module } from '@nestjs/common';
import { DocumentsMService } from './documents-m.service';
import { DocumentsMController } from './documents-m.controller';

@Module({
  controllers: [DocumentsMController],
  providers: [DocumentsMService]
})
export class DocumentsMModule {}
