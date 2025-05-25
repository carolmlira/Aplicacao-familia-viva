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
exports.SobreService = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../firebase/firebase.service");
const firebase_config_1 = require("../config/firebase.config");
const uuid_1 = require("uuid");
let SobreService = class SobreService {
    firebaseService;
    sobre = null;
    collection = firebase_config_1.firestore.collection('sobre');
    constructor(firebaseService) {
        this.firebaseService = firebaseService;
    }
    async create(data, images) {
        const id = (0, uuid_1.v4)();
        let imageUrl = null;
        if (images && images.length > 0) {
            const file = images[0];
            const ext = file.originalname.split('.').pop();
            const imageId = (0, uuid_1.v4)();
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
    async update(id, data, images) {
        const docRef = this.collection.doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            throw new common_1.NotFoundException(`Documento 'sobre' com ID ${id} não encontrado`);
        }
        const existingData = doc.data();
        if (!existingData) {
            throw new common_1.NotFoundException(`Dados do documento 'sobre' com ID ${id} não encontrados`);
        }
        let imageUrl = existingData.imageUrl || null;
        if (images && images.length > 0) {
            if (imageUrl) {
                const path = decodeURIComponent(imageUrl.split('/o/')[1].split('?')[0]);
                await this.firebaseService.deleteFile(path);
            }
            const file = images[0];
            const ext = file.originalname.split('.').pop();
            const imageId = (0, uuid_1.v4)();
            const filename = `sobre/${id}/${imageId}.${ext}`;
            imageUrl = await this.firebaseService.uploadFile(file, filename);
        }
        const updatedData = {
            ...existingData,
            ...data,
            imageUrl,
            updatedAt: new Date(),
        };
        await docRef.set(updatedData);
        return updatedData;
    }
    async findAll() {
        const snapshot = await this.collection.get();
        const sobreList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        return sobreList;
    }
    async remove(id) {
        const docRef = this.collection.doc(id);
        const doc = await docRef.get();
        if (!doc.exists)
            return null;
        const data = doc.data();
        if (data?.imageUrl) {
            const path = decodeURIComponent(data.imageUrl.split('/o/')[1].split('?')[0]);
            await this.firebaseService.deleteFile(path);
        }
        await docRef.delete();
        return { deleted: true };
    }
};
exports.SobreService = SobreService;
exports.SobreService = SobreService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService])
], SobreService);
//# sourceMappingURL=sobre.service.js.map