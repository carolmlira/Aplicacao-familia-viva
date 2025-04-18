import { Injectable } from '@nestjs/common';
 import { cert } from 'firebase-admin/app';
 import * as admin from 'firebase-admin';
 
 @Injectable()
 export class FirebaseService {
   private storage;
   private messaging;
 
   constructor() {
     // Verifica se já existe uma app do Firebase inicializada
     if (!admin.apps.length) {
       const serviceAccount = require('../../src/config/familia-viva-recife-firebase-adminsdk-fbsvc-d7800a47bd.json');
 
       admin.initializeApp({
         credential: cert(serviceAccount),
         storageBucket: 'gs://familia-viva-recife.firebasestorage.app', 
       });
     }
 
     this.storage = admin.storage();
     this.messaging = admin.messaging();
   }
 
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
 }