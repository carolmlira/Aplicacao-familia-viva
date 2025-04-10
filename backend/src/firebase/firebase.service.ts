// src/firebase/firebase.service.ts
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { cert } from 'firebase-admin/app';
import { join } from 'path';

@Injectable()
export class FirebaseService {
  private storage;
  private messaging;
  private firestore;
  private realtime;

  constructor() {
    if (!admin.apps.length) {
      const serviceAccount = require(join(__dirname, '..', '..', 'src', 'config', 'familia-viva-recife-firebase-adminsdk-fbsvc-d7800a47bd.json'));

      admin.initializeApp({
        credential: cert(serviceAccount),
        storageBucket: 'gs://familia-viva-recife.firebasestorage.app',
        databaseURL: 'https://familia-viva-recife-default-rtdb.firebaseio.com/',
      });
    }

    this.storage = admin.storage();
    this.messaging = admin.messaging();
    this.firestore = admin.firestore();
    this.realtime = admin.database();
  }

  // Upload para o Storage
  async uploadFile(file: Express.Multer.File, filename: string): Promise<string> {
    const bucket = this.storage.bucket();
    const blob = bucket.file(filename);

    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      blobStream.on('error', (err) => reject(err));

      blobStream.on('finish', async () => {
        await blob.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        resolve(publicUrl);
      });

      blobStream.end(file.buffer);
    });
  }

  // Firestore - Criar documento
  async createFirestoreDoc(collection: string, data: any) {
    const docRef = await this.firestore.collection(collection).add(data);
    return { id: docRef.id };
  }

  // Realtime DB - Criar dados
  async createRealtimeData(path: string, data: any) {
    const ref = this.realtime.ref(path).push();
    await ref.set(data);
    return { key: ref.key };
  }
}
