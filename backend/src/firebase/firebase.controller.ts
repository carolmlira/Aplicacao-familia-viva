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
  
    const fullPath = pageId
      ? `${category}/${subgrup}/${pageId}/${filename}`
      : `${category}/${filename}`;
  
    await this.firebaseService.deleteFile(fullPath);
    return { message: `Arquivo ${fullPath} deletado com sucesso.` };
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
    await this.firebaseService.deleteFolder(folderPath); // novo método
    return { message: `Pasta ${folderPath} deletada com sucesso.` };
  }
  
  @Get('list')
  async listFiles(@Query('category') category: string) {
    const files = await this.firebaseService.listFilesInCategory(category);
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
  
    // Verifica se categoria existe, se quiser aplicar alguma lógica aqui.
    // Aqui você pode também montar o caminho incluindo a categoria, se necessário.
  

    const urls = await this.firebaseService.listFilesInPage(pageId, category); // método novo ou reutilizado
    return { files: urls };
  }
  
}
