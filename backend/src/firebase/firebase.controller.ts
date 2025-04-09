import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from './firebase.service';

@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) // 👈 obrigatório!
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('file:', file); // debug
    const filename = file.originalname;
    const url = await this.firebaseService.uploadFile(file, filename);
    return { url };
  }
}
