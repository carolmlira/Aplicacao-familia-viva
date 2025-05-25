"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseService = void 0;
const common_1 = require("@nestjs/common");
const admin = require("firebase-admin");
const firebase_config_1 = require("../config/firebase.config");
let FirebaseService = class FirebaseService {
    firestore = firebase_config_1.firestore;
    storage = firebase_config_1.storage;
    bucket = this.storage.bucket();
    messaging = admin.messaging();
    constructor() {
        this.firestore
            .collection('users')
            .limit(1)
            .get()
            .then((snapshot) => {
            console.log(`🔥 Firestore acessado com sucesso. Documentos encontrados: ${snapshot.size}`);
        })
            .catch((err) => {
            console.error('❌ Erro ao acessar Firestore:', err);
        });
    }
    async uploadFile(file, filename) {
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
                await blob.makePublic();
                resolve(`https://storage.googleapis.com/${this.bucket.name}/${blob.name}`);
            });
            blobStream.end(file.buffer);
        });
    }
    async getFileUrl(filename) {
        const file = this.bucket.file(filename);
        await file.makePublic();
        return `https://storage.googleapis.com/${this.bucket.name}/${file.name}`;
    }
    async deleteFileByUrl(fileUrl) {
        if (!fileUrl)
            return;
        const baseUrl = `https://storage.googleapis.com/${this.bucket.name}/`;
        if (!fileUrl.startsWith(baseUrl)) {
            throw new Error('URL inválida ou não pertence ao bucket configurado');
        }
        const filename = fileUrl.replace(baseUrl, '');
        await this.deleteFile(filename);
    }
    async deleteFile(filename) {
        const file = this.bucket.file(filename);
        await file.delete();
        console.log(`Arquivo ${filename} deletado com sucesso.`);
    }
    async deleteFolder(folderPath) {
        const [files] = await this.bucket.getFiles({ prefix: folderPath });
        await Promise.all(files.map((file) => file.delete()));
    }
    async listFiles(prefix) {
        const [files] = await this.bucket.getFiles({ prefix });
        return files.map((file) => file.name);
    }
    async listFilesInCategory(category, subgrup) {
        const prefix = `${category}/${subgrup}/`;
        const [files] = await this.bucket.getFiles({ prefix });
        return files
            .filter((file) => !file.name.endsWith('/'))
            .map((file) => file.name.replace(/^gallery\//, ''));
    }
    async getCollectionByPath(path) {
        return await this.firestore.collection(path).get();
    }
    async listFilesInPage(pageId, category) {
        const prefix = `pages/${category}/${pageId}/`;
        const [files] = await this.bucket.getFiles({ prefix });
        return Promise.all(files.map(async (file) => {
            await file.makePublic();
            return `https://storage.googleapis.com/${this.bucket.name}/${file.name}`;
        }));
    }
    async getUserById(id) {
        const doc = await this.firestore.collection('users').doc(id).get();
        return doc.exists ? doc.data() : null;
    }
    async updateUserImage(id, photoURL, filename) {
        await this.firestore
            .collection('users')
            .doc(id)
            .update({ photoURL, filename });
    }
};
exports.FirebaseService = FirebaseService;
exports.FirebaseService = FirebaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], FirebaseService);
//# sourceMappingURL=firebase.service.js.map