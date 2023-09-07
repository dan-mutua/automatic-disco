import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { DocumentsMService } from './documents-m.service';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
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
    description: 'Creates a new docs ',
    type: DocumentsM,
  })
  //   async uploadDocument(@UploadedFile() file: any) {
  //     await this.documentsMService.uploadDocument(file);
  //     return {
  //       success: true,
  //     };
  //   }
  // }
  @UseInterceptors(
    FileInterceptor('postDocs', {
      storage: diskStorage({
        destination: './files',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  createPost(
    @Request() req,
    @Body() post: DocumentsM,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<DocumentsM> {
    return this.documentsMService.createPost(req.user, post, file);
  }
  // create(@Body() createDocumentsM: DocumentsM) {
  //   return this.documentsMService.create(createDocumentsM);
  // }

  @Get()
  // @Roles(UserRole.SCOUT, UserRole.ADMIN, UserRole.SUPERUSER, UserRole.USER)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiResponse({
    status: 200,
    description: 'Returns an array of all documents details',
    type: [DocumentsM],
  })
  // findAll() {
  //   return this.documentsMService.findAll();
  // }
  async findAll(@Query() query: any): Promise<DocumentsM[]> {
    return this.documentsMService.findAll(query);
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
