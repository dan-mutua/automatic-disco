import { Inject, Injectable } from '@nestjs/common';
import { DocumentsM } from './entities/documents-m.entity';
import { Repository, DeleteResult } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class DocumentsMService {
  constructor(
    @Inject('DOCUMENT_REPOSITORY')
    private documentsRepository: Repository<DocumentsM>,
  ) {}

  async createPost(
    user: User,
    post: DocumentsM,
    file: Express.Multer.File,
  ): Promise<DocumentsM> {
    return await this.documentsRepository.save({
      ...post,
      imgUrl: `/files/${file.filename}`,
      user,
    });
  }

  downloadDocument(path: string) {
    return `This action removes a #${path} document`;
  }

  public async findAll(): Promise<DocumentsM[]> {
    return this.documentsRepository.find({
      relations: ['user', 'country', 'documentType', 'documentName'],
    });
  }
  queryFilter = (doc: DocumentsM) => {
    return { where: { user: doc.user } };
  };

  // async findLoginedAllDocs(user: User): Promise<DocumentsM[]> {
  //   return await this.documentsRepository.find( where: { user });
  // }
  // async findLoginedAllDocs(user: User): Promise<DocumentsM[]> {
  //   const queryFilter = (doc: DocumentsM) => doc.user === user;
  //   return await this.documentsRepository.find(queryFilter);
  // }

  // async findLoginedAllDocs(user: User): Promise<DocumentsM[]> {
  //   const queryFilter = (doc: DocumentsM) => {
  //     return { where: { user: doc.user } };
  //   };
  //   return await this.documentsRepository.find(queryFilter);
  // }

  public async findOne(id: number): Promise<DocumentsM> {
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

  public async delete(id: number): Promise<DeleteResult> {
    return await this.documentsRepository.delete(id);
  }
}
