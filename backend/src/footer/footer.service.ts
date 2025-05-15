import { Injectable } from '@nestjs/common';
import { CreateFooter } from './dto/create-footer/create-footer';
import { UpdateFooter } from './dto/update-footer/update-footer';
import { firestore } from '../config/firebase.config';

@Injectable()
export class FooterService {
  private collection = firestore.collection('footer');
  private docId = 'footer-info'; // define um ID fixo, ou gere dinamicamente se quiser múltiplos

  async getFooter() {
    const doc = await this.collection.doc(this.docId).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  async updateFooter(data: UpdateFooter) {
    await this.collection.doc(this.docId).set({ ...data }, { merge: true });
    const updated = await this.collection.doc(this.docId).get();
    return { id: updated.id, ...updated.data() };
  }

  async createFooter(data: CreateFooter) {
    await this.collection.doc(this.docId).set({ ...data });
    return { id: this.docId, ...data };
  }
}
