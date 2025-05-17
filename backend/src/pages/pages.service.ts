import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreatePageDto } from './dto/create-page.dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto/update-page.dto';
import { firestore, admin } from '../config/firebase.config'
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class PagesService {
  private collection = firestore.collection('pages');
    constructor(private readonly firebaseService: FirebaseService) {} // Injetando seu serviço!
  
    async create(createPageDto: CreatePageDto, category: string, images?: Express.Multer.File[]) {
      const id = uuidv4();
      let imageUrls: string[] = [];
    
      // Upload das imagens
      if (images && images.length > 0) {
        for (const file of images) {
          const ext = file.originalname.split('.').pop(); // extensão original
          const generatedId = uuidv4(); // gera um ID único
          const filename = `pages/${category}/${id}/${generatedId}.${ext}`;
          const imageUrl = await this.firebaseService.uploadFile(file, filename);
          imageUrls.push(imageUrl);
        }
      }
    
      // Criação do objeto
      const newPage: any = removeUndefinedFields({
        id,
        ...createPageDto,
        createdAt: new Date(),
        updatedAt: new Date(),
        imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
      });

    
      if (imageUrls.length > 0) {
        newPage.imageUrls = imageUrls;
      }
    
      // Remoção do campo 'images' se estiver undefined
      if (newPage.images === undefined) {
        delete newPage.images;
      }
    
      console.log('Objeto a ser enviado ao Firestore:', newPage);
    
      // Caminho correto: pages/{category}/items/{id}
      const pageDocRef = this.collection
        .doc(category)
        .collection('items')
        .doc(id);
    
      await pageDocRef.set(newPage);
      return newPage;
    }
    
    // Função para buscar todas as páginas dentro de uma categoria
    async findAll(category: string) {
      const categoryCollection = this.collection.doc(category).collection('items');
      const snapshot = await categoryCollection.get();
      return snapshot.docs.map(doc => doc.data());
    }

    async findAllProjects(): Promise<any[]> {
      const snapshot = await firestore
        .collection('pages/projects/items')
        .get();
    
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    }

    // Função para buscar uma página específica dentro de uma categoria
    async findOne(id: string, category: string) {
      const categoryCollection = this.collection.doc(category).collection('items');
      const doc = await categoryCollection.doc(id).get();
      if (!doc.exists) {
        throw new NotFoundException(`Página com ID ${id} não encontrada na categoria ${category}`);
      }
      return doc.data();
    }

    // Função para atualizar uma página dentro de uma categoria
    async update(id: string, updatePageDto: UpdatePageDto, category: string) {
      console.log('Dados recebidos:', updatePageDto);
      const categoryCollection = this.collection.doc(category).collection('items');
      const docRef = categoryCollection.doc(id);
      const doc = await docRef.get();
      if (!doc.exists) {
        throw new NotFoundException(`Página com ID ${id} não encontrada na categoria ${category}`);
      }
      const updated = { ...doc.data(), ...updatePageDto };
      await docRef.set(updated);
      return updated;
    }

    // Função para excluir uma página dentro de uma categoria
    async remove(id: string, category: string) {
      const categoryCollection = this.collection.doc(category).collection('items');
      const docRef = categoryCollection.doc(id);
      const doc = await docRef.get();
    
      if (!doc.exists) return null;
    
      const data = doc.data();
    
      // Se tiver imagens, deletar do storage
      if (data?.imageUrls && Array.isArray(data.imageUrls)) {
        for (const url of data.imageUrls) {
          try {
            // Extrair o caminho do Storage a partir da URL pública
            const path = decodeURIComponent(
              url.split('/o/')[1].split('?')[0]
            );
            await this.firebaseService.deleteFile(path);
            console.log(`Imagem deletada: ${path}`);
          } catch (err) {
            console.error(`Erro ao deletar imagem: ${url}`, err);
          }
        }
      }
    
      // Deleta o documento do Firestore
      await docRef.delete();
      return { deleted: true };
    }
}

function removeUndefinedFields(obj: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined)
  );
}
