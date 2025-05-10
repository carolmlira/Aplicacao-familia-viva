import { Injectable } from '@nestjs/common';
 import { cert } from 'firebase-admin/app';
 import * as admin from 'firebase-admin';
 
 @Injectable()
 export class FirebaseService {
   private storage;
   private messaging;
   private bucket;
   private firestore: FirebaseFirestore.Firestore;

   constructor() {
    if (!admin.apps.length) {
      const serviceAccount = require('../../src/config/familia-viva-recife-firebase-adminsdk-fbsvc-d7800a47bd.json');
  
      admin.initializeApp({
        credential: cert(serviceAccount),
        storageBucket: 'gs://familia-viva-recife.firebasestorage.app',
      });
    }
  
    this.storage = admin.storage();
    this.bucket = this.storage.bucket();
    this.messaging = admin.messaging();
    this.firestore = admin.firestore();  
  }
  
   async uploadFile(file: Express.Multer.File, filename: string): Promise<string> {
    if (!file || !filename) {
      throw new Error('Arquivo ou nome do arquivo inválido');
    }
  
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
  
   async getFileUrl(filename: string): Promise<string> {
    const bucket = this.storage.bucket();
    const file = bucket.file(filename);
  
    // Garante que o arquivo seja público (caso não esteja ainda)
    await file.makePublic();
  
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
    return publicUrl;
  }
  

   async deleteFile(filename: string): Promise<void> {
    const bucket = this.storage.bucket();
    const file = bucket.file(filename);
  
    try {
      await file.delete();
      console.log(`Arquivo ${filename} deletado com sucesso.`);
    } catch (err) {
      console.error(`Erro ao deletar ${filename}:`, err);
      throw err;
    }
  }
  async deleteFolder(folderPath: string): Promise<void> {
    const bucket = this.storage.bucket();
    const [files] = await bucket.getFiles({ prefix: folderPath });
    const deletions = files.map((file) => file.delete());
    await Promise.all(deletions);
  }
  

  async listFiles(prefix: string): Promise<string[]> {
    const [files] = await this.bucket.getFiles({ prefix });
    return files.map(file => file.name);
  }

  async listFilesInCategory(category: string, subgrup: string): Promise<string[]> {
    const bucket = this.storage.bucket();
    const prefix = `${category}/${subgrup}/`;

    const [files] = await bucket.getFiles({ prefix });

    // Filtra para garantir que estamos listando apenas arquivos e não subdiretórios
    return files
      .filter(file => !file.name.endsWith('/'))
      .map(file => file.name.replace(/^Gallery\//, ''));

  }

  async getCollectionByPath(path: string) {
    const collectionRef = this.firestore.collection(path);
    return await collectionRef.get();
  }
  
  async listFilesInPage(pageId: string, category: string): Promise<string[]> {
    const prefix = `pages/${category}/${pageId}/`;
    const bucket = this.storage.bucket();
    const [files] = await bucket.getFiles({ prefix });
  
    const urls: string[] = [];
  
    for (const file of files) {
      await file.makePublic(); // opcional, se já estiverem públicos, pode ser omitido
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
      urls.push(publicUrl);
    }
  
    return urls;
  }
  
}