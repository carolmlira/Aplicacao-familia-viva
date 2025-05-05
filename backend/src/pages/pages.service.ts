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
  
    async create(createPageDto: CreatePageDto, category: string, image?: Express.Multer.File) {
      const id = uuidv4();
      let imageUrl: string | null = null;
  
      if (image) {
        const filename = `pages/${category}/${id}_${image.originalname}`;
        imageUrl = await this.firebaseService.uploadFile(image, filename);
      }
  
      const newPage = {
        id,
        ...createPageDto,
        imageUrl, // salva a URL da imagem no Firestore
      };
  
      const categoryCollection = this.collection.doc(category).collection('items');
      await categoryCollection.doc(id).set(newPage);
  
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
    const doc = await categoryCollection.doc(id).get();
    if (!doc.exists) return null;
    await categoryCollection.doc(id).delete();
    return { deleted: true };
  }
}
