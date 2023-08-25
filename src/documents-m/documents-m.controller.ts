import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DocumentsMService } from './documents-m.service';
import { CreateDocumentsMDto } from './dto/create-documents-m.dto';
import { UpdateDocumentsMDto } from './dto/update-documents-m.dto';

@Controller('documents-m')
export class DocumentsMController {
  constructor(private readonly documentsMService: DocumentsMService) {}

  @Post()
  create(@Body() createDocumentsMDto: CreateDocumentsMDto) {
    return this.documentsMService.create(createDocumentsMDto);
  }

  @Get()
  findAll() {
    return this.documentsMService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentsMService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocumentsMDto: UpdateDocumentsMDto) {
    return this.documentsMService.update(+id, updateDocumentsMDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentsMService.remove(+id);
  }
}
