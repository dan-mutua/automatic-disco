import { Module } from '@nestjs/common';
import { DocumentsMService } from './documents-m.service';
import { DocumentsMController } from './documents-m.controller';
import { docProviders } from './documents-m.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [DocumentsMController],
  providers: [...docProviders, DocumentsMService],
})
export class DocumentsMModule {}
