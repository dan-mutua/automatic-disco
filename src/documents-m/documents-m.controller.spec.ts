import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsMController } from './documents-m.controller';
import { DocumentsMService } from './documents-m.service';

describe('DocumentsMController', () => {
  let controller: DocumentsMController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsMController],
      providers: [DocumentsMService],
    }).compile();

    controller = module.get<DocumentsMController>(DocumentsMController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
