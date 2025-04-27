import { Controller, Post, Get, Put, Delete, Param, UploadedFile, UseInterceptors, Body, Query } from '@nestjs/common';
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
  ) {
    console.log('file:', file); // debug
    const ext = file.originalname.split('.').pop(); // Pega a extensão do arquivo
    const filename = `${category}/${uuidv4()}.${ext}`; // Usa a categoria no nome do arquivo
    const url = await this.firebaseService.uploadFile(file, filename); // Chama o serviço para fazer o upload
    return { url };
  }
  
  @Get('file/:filename')
  async getFile(@Param('filename') filename: string) {
    const url = await this.firebaseService.getFileUrl(filename);
    return { url };
  }

  @Put('update/:filename')
  @UseInterceptors(FileInterceptor('file'))
  async updateFile(
    @Param('filename') filename: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // 1. Deletar o antigo
    await this.firebaseService.deleteFile(filename);

    // 2. Fazer upload do novo com o mesmo nome
    const url = await this.firebaseService.uploadFile(file, filename);
    return { url };
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

}
