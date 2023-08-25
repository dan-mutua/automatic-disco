import { Inject, Injectable } from '@nestjs/common';
import { CreateDocumentsMDto } from './dto/create-documents-m.dto';
import { UpdateDocumentsMDto } from './dto/update-documents-m.dto';
import { DocumentsM } from './entities/documents-m.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DocumentsMService {
  constructor(
    @Inject('FARM_REPOSITORY')
    private farmsRepository: Repository<DocumentsM>,
  ) {}

  create(createDocumentsMDto: CreateDocumentsMDto) {
    return 'This action adds a new documentsM';
  }

  async findAll(): Promise<DocumentsM[]> {
    return this.farmsRepository.find({
      relations: ['country', 'farmProjects'],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} documentsM`;
  }

  update(id: number, updateDocumentsMDto: UpdateDocumentsMDto) {
    return `This action updates a #${id} documentsM`;
  }

  remove(id: number) {
    return `This action removes a #${id} documentsM`;
  }
}
