import { Connection } from 'typeorm';
import { DocumentsM } from './entities/documents-m.entity';
import { DocumentsMService } from './documents-m.service';

export const docProviders = [
  DocumentsMService,
  {
    provide: 'DOCUMENT_REPOSITORY',
    useFactory: (connection: Connection) =>
      connection.getRepository(DocumentsM),
    inject: ['DATABASE_CONNECTION'],
  },
];
