import { Controller, Post, Get, Put, Delete, Param, UploadedFile, UseInterceptors, UploadedFiles, Query, BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from './firebase.service';
import { firestore } from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid'; 

@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @Post('upload-gallery')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('category') category: string,
    @Query('pageId') pageId?: string,
  ) {
    if (category === 'pages' && !pageId) {
      throw new BadRequestException('pageId é obrigatório para uploads na categoria "pages".');
    }

    const uploadResults: { url: string; filename: string }[] = [];

    for (const file of files) {
      const ext = file.originalname.split('.').pop();
      const generatedId = uuidv4();
      const filename = category === 'pages'
        ? `pages/${category}/${pageId}/${generatedId}.${ext}`
        : `${category}/${generatedId}.${ext}`;

      const url = await this.firebaseService.uploadFile(file, filename);
      uploadResults.push({ url, filename });
    }

    return uploadResults;
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('category') category: string,
    @Query('pageId') pageId?: string,
  ) {
    // Verifica se a categoria é 'pages' e valida a presença do pageId
    if (category === 'pages') {
      if (!pageId) {
        throw new BadRequestException('pageId é obrigatório para uploads na categoria "pages".');
      }

      // Pega a extensão do arquivo
      const ext = file.originalname.split('.').pop();
      // Gera um ID único para o arquivo
      const generatedId = uuidv4();
      // Cria o caminho completo com o ID gerado e a extensão
      const filename = `pages/${category}/${pageId}/${generatedId}.${ext}`;

      // Realiza o upload e obtém a URL do arquivo
      const url = await this.firebaseService.uploadFile(file, filename);
      return { url, filename }; // Retorna a URL e o nome do arquivo
    }

    // Para outras categorias, o processo é similar
    const ext = file.originalname.split('.').pop();
    const generatedId = uuidv4();
    const filename = `${category}/${generatedId}.${ext}`;

    // Faz o upload do arquivo e retorna a URL
    const url = await this.firebaseService.uploadFile(file, filename);
    return { url, filename }; // Retorna a URL e o nome do arquivo
  }

  @Post('upload/sobre')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSobreImage(@UploadedFile() file: Express.Multer.File) {
    const url = await this.firebaseService.uploadFile(file, 'sobre');
    return { url };
  }

  @Post('upload/logo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadLogoImage(@UploadedFile() file: Express.Multer.File) {
    const url = await this.firebaseService.uploadFile(file, 'logo');
    return { url };
  }

  @Post('upload/user/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadUserImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    const userData = await this.firebaseService.getUserById(id);

    if (userData?.filename) {
      await this.firebaseService.deleteFile(userData.filename);
    }

    const ext = file.originalname.split('.').pop();
    const filename = `user/${id}/${uuidv4()}.${ext}`;
    const url = await this.firebaseService.uploadFile(file, filename);

    await this.firebaseService.updateUserImage(id, url, filename);

    return { url };
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
    @Query('subgrup') subgrup: string,
    @Query('filename') filename: string, 
    @Query('newName') newName: string,   
    @Query('pageId') pageId?: string
  ) {
    if (!category || !filename || !newName) {
      throw new BadRequestException('Categoria, filename e newName são obrigatórios.');
    }
  
    let oldPath: string;
    let newPath: string;
  
    if (category === 'pages') {
      if (!pageId) {
        throw new BadRequestException('pageId é obrigatório para categoria "pages".');
      }

      oldPath = `pages/${subgrup}/${pageId}/${filename}`;
      newPath = `pages/${subgrup}/${pageId}/${newName}`;
    } else {
      oldPath = `${category}/${filename}`;
      newPath = `${category}/${newName}`;
    }
  
    // 1. Deleta o antigo
    await this.firebaseService.deleteFile(oldPath);
  
    // 2. Faz upload com novo nome
    const url = await this.firebaseService.uploadFile(file, newPath);
    return { url };
  }

  @Get('logo')
  async getLogoUrl() {
    const url = await this.firebaseService.getFileUrl('logo');
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

  @Delete('delete')
  async deleteFileGeneric(
    @Query('category') category: string,
    @Query('subgrup') subgrup: string,
    @Query('filename') filename: string,
    @Query('pageId') pageId?: string,
  ) {
    if (!category || !filename) {
      throw new BadRequestException('Parâmetros obrigatórios: category e filename');
    }
    let fullPath: string;
  
    // Mostra o caminho antes de montar o caminho completo
    console.log(`category: ${category}, subgrup: ${subgrup}, pageId: ${pageId}, filename: ${filename}`);
  
    // Montando o caminho completo com base nos parâmetros
    if (subgrup && pageId) {
      fullPath = `${category}/${subgrup}/${pageId}/${filename}`;
    } else if (subgrup) {
      fullPath = `${category}/${subgrup}/${filename}`;
    } else if (pageId) {
      fullPath = `${category}/${filename}`;
    } else {
      fullPath = `${category}/${filename}`;
    }
  
    // Mostra o caminho final montado
    console.log(`Caminho completo do arquivo a ser deletado: ${fullPath}`);
  
    try {
      await this.firebaseService.deleteFile(fullPath);
      return { message: `Arquivo ${fullPath} deletado com sucesso.` };
    } catch (error) {
      console.error(`Erro ao deletar arquivo: ${error.message}`);
      throw new BadRequestException(`Erro ao deletar arquivo: ${error.message}`);
    }
  }
  
  @Delete('delete-gallery')
  async delete(@Query('filename') filename: string) {
    return this.firebaseService.deleteFile(filename);
  }

  @Delete('delete-folder')
  async deleteFolder(
    @Query('category') category: string,
    @Query('subgrup') subgrup: string,
    @Query('pageId') pageId: string,
  ) {
    if (!category || !subgrup || !pageId) {
      throw new BadRequestException('category, subgrup e pageId são obrigatórios.');
    }
  
    const folderPath = `${category}/${subgrup}/${pageId}`;
    await this.firebaseService.deleteFolder(folderPath); 
    return { message: `Pasta ${folderPath} deletada com sucesso.` };
  }
  
  @Delete('delete/user/:id')
  async deleteUserPhoto(@Param('id') id: string) {
    const userData = await this.firebaseService.getUserById(id);

    if (!userData?.filename) {
      throw new BadRequestException('Usuário não possui imagem cadastrada.');
    }

    try {
      await this.firebaseService.deleteFile(userData.filename);
      await this.firebaseService.updateUserImage(id, '', ''); // limpa os campos no banco
      return { message: 'Foto do usuário deletada com sucesso.' };
    } catch (error) {
      throw new BadRequestException(`Erro ao deletar foto: ${error.message}`);
    }
  }
  
  @Get('list')
  async listFiles(@Query('category') category: string) {
    const prefix = `${category}/`; // lista tudo dentro de gallery/
    const files = await this.firebaseService.listFiles(prefix);
    return { files };
  }

  @Get('pages/:category/files')
  async getPageFilesByCategory(
    @Param('category') category: string,
    @Query('pageId') pageId: string,
  ) {
    if (!pageId) {
      throw new BadRequestException('pageId não informado');
    }
    const urls = await this.firebaseService.listFilesInPage(pageId, category); // método novo ou reutilizado
    return { files: urls };
  }
  
}
