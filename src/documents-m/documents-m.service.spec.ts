import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsMService } from './documents-m.service';

describe('DocumentsMService', () => {
  let service: DocumentsMService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentsMService],
    }).compile();

    service = module.get<DocumentsMService>(DocumentsMService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
