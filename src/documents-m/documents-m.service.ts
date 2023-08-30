import { Inject, Injectable } from '@nestjs/common';
import { DocumentsM } from './entities/documents-m.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DocumentsMService {
  constructor(
    @Inject('DOCUMENT_REPOSITORY')
    private documentsRepository: Repository<DocumentsM>,
  ) {}

  async create(createDocumentsMDto: DocumentsM) {
    const documentsM = new DocumentsM();
    documentsM.documentName = createDocumentsMDto.documentName;
    documentsM.documentType = createDocumentsMDto.documentType;
    documentsM.documentSrc = createDocumentsMDto.documentSrc;
    documentsM.userId = createDocumentsMDto.userId;
    documentsM.status = createDocumentsMDto.status;
    documentsM.country = createDocumentsMDto.country;

    return await this.documentsRepository.save(documentsM);
  }

  // async findAll(queryParams?: QueryStringParams): Promise<DocumentsM[]> {
  //   return await this.documentsRepository.find({
  //     where: queryParams,
  //   });
  // }

  async findAll(): Promise<DocumentsM[]> {
    return this.documentsRepository.find({
      relations: ['user', 'country', 'documentType', 'documentName'],
    });
  }

  async findOne(id: number): Promise<DocumentsM> {
    return this.documentsRepository.findOne({
      where: {
        id,
      },
    });
  }

  public async update(
    id: number,
    newValue: DocumentsM,
  ): Promise<DocumentsM | null> {
    const todo = await this.documentsRepository.findOneOrFail({
      where: { id },
    });
    if (!todo.id) {
      console.error("document doesn't exist");
    }
    await this.documentsRepository.update(id, newValue);
    return await this.documentsRepository.findOne({
      where: { id },
    });
  }
}
