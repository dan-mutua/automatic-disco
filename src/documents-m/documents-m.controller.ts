import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DocumentsMService } from './documents-m.service';
import { CreateDocumentsMDto } from './dto/create-documents-m.dto';
import { UpdateDocumentsMDto } from './dto/update-documents-m.dto';
import { DocumentsM } from './entities/documents-m.entity';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Document-module')
@Controller('documents-m')
export class DocumentsMController {
  constructor(private readonly documentsMService: DocumentsMService) {}

  @Post()
  // @UseGuards(AuthGuard('jwt'))
  // @UseGuards(RolesGuard)
  // @Roles(UserRole.ADMIN, UserRole.SUPERUSER)
  @ApiResponse({
    status: 201,
    description: 'Creates a new farm',
    type: DocumentsM,
  })
  create(@Body() createDocumentsM: DocumentsM) {
    return this.documentsMService.create(createDocumentsM);
  }

  @Get()
  // @Roles(UserRole.SCOUT, UserRole.ADMIN, UserRole.SUPERUSER, UserRole.USER)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiResponse({
    status: 200,
    description: 'Returns an array of all documents details',
    type: [DocumentsM],
  })
  findAll() {
    return this.documentsMService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.documentsMService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocumentsM: DocumentsM) {
    return this.documentsMService.update(+id, updateDocumentsM);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentsMService.delete(+id);
  }
}
