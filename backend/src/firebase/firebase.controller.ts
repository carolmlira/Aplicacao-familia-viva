import { Controller, Post, Get, Put, Delete, Param, UploadedFile, UseInterceptors, Body, Query, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from './firebase.service';
import { v4 as uuidv4 } from 'uuid'; 

@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('category') category: string,
    @Query('pageId') pageId?: string, // pageId é opcional, só será usado se a categoria for "pages"
  ) {
    console.log('file:', file); // debug
    const ext = file.originalname.split('.').pop(); // Pega a extensão do arquivo
    let filename: string;

    // Se for da categoria "pages", verificamos se o pageId foi fornecido
    if (category === 'pages') {
      if (!pageId) {
        // Caso não tenha um pageId, podemos lançar um erro ou salvar em um diretório genérico
        throw new Error('pageId é obrigatório para uploads na categoria "pages".');
      }
      filename = `pages/${pageId}/${uuidv4()}.${ext}`; // Cria um caminho específico para as páginas
    } else {
      filename = `${category}/${uuidv4()}.${ext}`; // Caso contrário, o caminho será baseado apenas na categoria
    }

    const url = await this.firebaseService.uploadFile(file, filename); // Chama o serviço para fazer o upload
    return { url, filename }; // Retorna o URL da imagem e o nome do arquivo
  }
  
  @Get('file/:filename')
  async getFile(@Param('filename') filename: string) {
    const url = await this.firebaseService.getFileUrl(filename);
    return { url };
  }

  @Put('update')
  @UseInterceptors(FileInterceptor('file'))
  async updateFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('category') category: string,
    @Query('filename') filename: string, // nome do arquivo antigo, sem o caminho
    @Query('pageId') pageId?: string
  ) {
    if (!category || !filename) {
      throw new BadRequestException('Categoria e filename são obrigatórios.');
    }
  
    let fullPath: string;
  
    if (category === 'pages') {
      if (!pageId) {
        throw new BadRequestException('pageId é obrigatório para categoria "pages".');
      }
      fullPath = `pages/${pageId}/${filename}`;
    } else {
      fullPath = `${category}/${filename}`;
    }
  
    // 1. Deleta o antigo
    await this.firebaseService.deleteFile(fullPath);
  
    // 2. Atualiza com mesmo nome
    const url = await this.firebaseService.uploadFile(file, fullPath);
    return { url };
  }
  
  @Get('pages')
  async getPagesByCategory(@Query('category') category: string) {
    if (!category) {
      throw new BadRequestException('Categoria não informada');
    }

    const snapshot = await this.firebaseService.getCollectionByPath(`pages/${category}/items`);
    const pages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { pages };
  }


  @Delete('delete/:category/:filename')
  async deleteFile(
    @Param('category') category: string,
    @Param('filename') filename: string,
  ) {
    const fullPath = `${category}/${filename}`;
    await this.firebaseService.deleteFile(fullPath);
    return { message: `Arquivo ${fullPath} deletado com sucesso.` };
  }
  

  @Get('list')
  async listFiles(@Query('category') category: string) {
    const files = await this.firebaseService.listFilesInCategory(category);
    return { files };
  }
  
  @Get('pages/files')
  async getPageFiles(@Query('pageId') pageId: string) {
    if (!pageId) {
      throw new BadRequestException('pageId não informado');
    }

    const urls = await this.firebaseService.listFilesInPage(pageId);
    return { files: urls };
  }


}
