import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { firestore, storage } from '../config/firebase.config';

@Injectable()
export class FirebaseService {
  private firestore = firestore;
  private storage = storage;
  private bucket = this.storage.bucket();
  private messaging = admin.messaging();

  constructor() {
    // Apenas para teste inicial da conexão
    this.firestore
      .collection('users')
      .limit(1)
      .get()
      .then((snapshot) => {
        console.log(
          `🔥 Firestore acessado com sucesso. Documentos encontrados: ${snapshot.size}`,
        );
      })
      .catch((err) => {
        console.error('❌ Erro ao acessar Firestore:', err);
      });
  }

  async uploadFile(
    file: Express.Multer.File,
    filename: string,
  ): Promise<string> {
    if (!file || !filename) {
      throw new Error('Arquivo ou nome do arquivo inválido');
    }

    const blob = this.bucket.file(filename);
    const blobStream = blob.createWriteStream({
      metadata: { contentType: file.mimetype },
    });

    return new Promise((resolve, reject) => {
      blobStream.on('error', reject);

      blobStream.on('finish', async () => {
        try {
          await blob.makePublic();
          resolve(
            `https://storage.googleapis.com/${this.bucket.name}/${blob.name}`,
          );
        } catch (err) {
          reject(err);
        }
      });

      blobStream.end(file.buffer);
    });
  }

  async getFileUrl(filename: string): Promise<string> {
    const file = this.bucket.file(filename);
    await file.makePublic();
    return `https://storage.googleapis.com/${this.bucket.name}/${file.name}`;
  }

  async deleteFileByUrl(fileUrl: string): Promise<void> {
    if (!fileUrl) return;
    const baseUrl = `https://storage.googleapis.com/${this.bucket.name}/`;
    if (!fileUrl.startsWith(baseUrl)) {
      throw new Error('URL inválida ou não pertence ao bucket configurado');
    }

    const filename = fileUrl.replace(baseUrl, '');
    await this.deleteFile(filename);
  }

  async deleteFile(filename: string): Promise<void> {
    const file = this.bucket.file(filename);
    try {
      await file.delete();
      console.log(`Arquivo ${filename} deletado com sucesso.`);
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 404
      ) {
        console.warn(
          `Arquivo ${filename} não encontrado para exclusão (já pode ter sido excluído ou não existia). Prosseguindo.`,
        );
      } else {
        console.error(
          `Erro inesperado ao tentar deletar arquivo ${filename}:`,
          error,
        );
        throw error;
      }
    }
  }

  async deleteFolder(folderPath: string): Promise<void> {
    const [files] = await this.bucket.getFiles({ prefix: folderPath });
    await Promise.all(files.map((file) => file.delete()));
  }

  async listFiles(prefix: string): Promise<string[]> {
    const [files] = await this.bucket.getFiles({ prefix });
    return files.map((file) => file.name);
  }

  async listFilesInCategory(
    category: string,
    subgrup: string,
  ): Promise<string[]> {
    const prefix = `${category}/${subgrup}/`;
    const [files] = await this.bucket.getFiles({ prefix });
    return files
      .filter((file) => !file.name.endsWith('/'))
      .map((file) => file.name.replace(/^gallery\//, ''));
  }

  async getCollectionByPath(path: string) {
    return await this.firestore.collection(path).get();
  }

  async listFilesInPage(pageId: string, category: string): Promise<string[]> {
    const prefix = `pages/${category}/${pageId}/`;
    const [files] = await this.bucket.getFiles({ prefix });

    return Promise.all(
      files.map(async (file) => {
        await file.makePublic();
        return `https://storage.googleapis.com/${this.bucket.name}/${file.name}`;
      }),
    );
  }

  async getUserById(id: string) {
    const doc = await this.firestore.collection('users').doc(id).get();
    return doc.exists ? doc.data() : null;
  }

  async updateUserImage(id: string, photoURL: string, filename: string) {
    await this.firestore
      .collection('users')
      .doc(id)
      .update({ photoURL, filename });
  }
}
