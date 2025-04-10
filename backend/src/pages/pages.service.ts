import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePageDto } from './dto/create-page.dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto/update-page.dto';
import { firestore } from '../config/firebase.config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PagesService {
  private collection = firestore.collection('pages');

  async create(createPageDto: CreatePageDto) {
    const newPage = {
      id: uuidv4(),
      ...createPageDto,
    };
    await this.collection.doc(newPage.id).set(newPage);
    return newPage;
  }

  async findAll() {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => doc.data());
  }

  async findOne(id: string) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      throw new NotFoundException(`Página com ID ${id} não encontrada`);
    }
    return doc.data();
  }

  async update(id: string, updatePageDto: UpdatePageDto) {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new NotFoundException(`Página com ID ${id} não encontrada`);
    }
    const updated = { ...doc.data(), ...updatePageDto };
    await docRef.set(updated);
    return updated;
  }

  async remove(id: string) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    await this.collection.doc(id).delete();
    return { deleted: true };
  }
}
