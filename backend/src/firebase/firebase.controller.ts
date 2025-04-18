import { Controller, Post, Get, Put, Delete, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from './firebase.service';
import { v4 as uuidv4 } from 'uuid'; 

@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('file:', file); // debug
    const ext = file.originalname.split('.').pop(); // pega a extensão do arquivo
    const filename = `${uuidv4()}.${ext}`; // nome único com extensão correta
    const url = await this.firebaseService.uploadFile(file, filename);
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

  @Delete('delete/:filename')
  async deleteFile(@Param('filename') filename: string) {
    await this.firebaseService.deleteFile(filename);
    return { message: `Arquivo ${filename} deletado com sucesso.` };
  }
}
