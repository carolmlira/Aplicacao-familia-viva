import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSobre } from './dto/create-sobre.dto/create-sobre';
import { FirebaseService } from 'src/firebase/firebase.service';
import { firestore } from '../config/firebase.config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SobreService {
  private sobre: CreateSobre | null = null;
  private collection = firestore.collection('sobre');

  constructor(private readonly firebaseService: FirebaseService) {}

  async create(data: any, images?: Express.Multer.File[]) {
    const id = uuidv4();
    let imageUrl: string | null = null;

    if (images && images.length > 0) {
      const file = images[0]; // usa apenas a primeira imagem
      const ext = file.originalname.split('.').pop();
      const imageId = uuidv4();
      const filename = `sobre/${id}/${imageId}.${ext}`;
      imageUrl = await this.firebaseService.uploadFile(file, filename);
    }

    const newSobre = {
      id,
      ...data,
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.collection.doc(id).set(newSobre);
    return newSobre;
  }

  async update(id: string, data: any, images?: Express.Multer.File) {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new NotFoundException(
        `Documento 'sobre' com ID ${id} não encontrado`,
      );
    }

    const existingData = doc.data();
    if (!existingData) {
      throw new NotFoundException(
        `Dados do documento 'sobre' com ID ${id} não encontrados`,
      );
    }

    let imagem: string = existingData.imagem || null;

    // Remove a imagem anterior, se existir
    // usa apenas a nova imagem

    if (images) {
      const ext = images.originalname.split('.').pop();
      const filename = `sobre.${ext}`;
      imagem = await this.firebaseService.uploadFile(images, filename);
    }

    const updatedData = {
      ...existingData,
      ...data,
      imagem,
      updatedAt: new Date(),
    };

    await docRef.set(updatedData);
    return updatedData;
  }

  async findAll() {
    const snapshot = await this.collection.get();

    const sobreList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return sobreList;
  }

  async remove(id: string) {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) return null;

    const data = doc.data();

    if (data?.imageUrl) {
      const path = decodeURIComponent(
        data.imageUrl.split('/o/')[1].split('?')[0],
      );
      await this.firebaseService.deleteFile(path);
    }

    await docRef.delete();
    return { deleted: true };
  }
}
