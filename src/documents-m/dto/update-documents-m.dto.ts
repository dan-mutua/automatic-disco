import { PartialType } from '@nestjs/swagger';
import { CreateDocumentsMDto } from './create-documents-m.dto';

export class UpdateDocumentsMDto extends PartialType(CreateDocumentsMDto) {}
