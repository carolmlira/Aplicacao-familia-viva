import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseInterceptors,
  UploadedFiles,
  Query,
} from '@nestjs/common';
import { PagesService } from './pages.service';
import { CreatePageDto } from './dto/create-page.dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto/update-page.dto';
import { FileInterceptor } from 'src/firebase/file.interceptor';

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post(':category')
  @UseInterceptors(
    new FileInterceptor('images', 10, {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  create(
    @Param('category') category: string,
    @UploadedFiles() images: Express.Multer.File[], // Agora um array
    @Body() createPageDto: CreatePageDto,
  ) {
    return this.pagesService.create(createPageDto, category, images);
  }

  // Buscar todas as páginas dentro de uma categoria
  @Get()
  async findAll(@Query('category') category: string) {
    const pages = await this.pagesService.findAll(category);
    return { pages };
  }

  // Buscar uma página específica dentro de uma categoria
  @Get(':category/:id')
  findOne(@Param('category') category: string, @Param('id') id: string) {
    return this.pagesService.findOne(id, category);
  }

  @Get('projects')
  async findProjects() {
    return this.pagesService.findAllProjects();
  }

  // Atualizar uma página dentro de uma categoria
  //@Patch(':category/items/:id')
  @Patch(':category/:id')
  update(
    @Param('category') category: string,
    @Param('id') id: string,
    @Body() updatePageDto: UpdatePageDto,
  ) {
    return this.pagesService.update(id, updatePageDto, category);
  }

  // Excluir uma página dentro de uma categoria
  @Delete(':category/:id')
  remove(@Param('category') category: string, @Param('id') id: string) {
    return this.pagesService.remove(id, category);
  }
}
