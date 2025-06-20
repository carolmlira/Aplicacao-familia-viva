import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  ParseUUIDPipe,
} from '@nestjs/common';
import { SobreService } from './sobre.service';
import { CreateSobre } from './dto/create-sobre.dto/create-sobre';
import { UpdateSobre } from './dto/update-sobre.dto/update-sobre';
import { FileInterceptor } from 'src/firebase/file.interceptor';

@Controller('sobre')
export class SobreController {
  constructor(private readonly sobreService: SobreService) {}

  @Post()
  @UseInterceptors(new FileInterceptor('imagem'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateSobre,
  ) {
    return this.sobreService.create(body, file ? [file] : []);
  }

  @Patch(':id')
  @UseInterceptors(
    new FileInterceptor('imagemSobre', 1, {
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
    }),
  )
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UpdateSobre,
  ) {
    return this.sobreService.update(id, body, file);
  }

  @Get()
  async findAll() {
    return this.sobreService.findAll();
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.sobreService.remove(id);
  }
}
