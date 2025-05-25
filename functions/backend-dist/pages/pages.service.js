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
exports.PagesService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const firebase_config_1 = require("../config/firebase.config");
const firebase_service_1 = require("../firebase/firebase.service");
let PagesService = class PagesService {
    firebaseService;
    collection = firebase_config_1.firestore.collection('pages');
    constructor(firebaseService) {
        this.firebaseService = firebaseService;
    }
    async create(createPageDto, category, images) {
        const id = (0, uuid_1.v4)();
        let imageUrls = [];
        if (images && images.length > 0) {
            for (const file of images) {
                const ext = file.originalname.split('.').pop();
                const generatedId = (0, uuid_1.v4)();
                const filename = `pages/${category}/${id}/${generatedId}.${ext}`;
                const imageUrl = await this.firebaseService.uploadFile(file, filename);
                imageUrls.push(imageUrl);
            }
        }
        const newPage = removeUndefinedFields({
            id,
            ...createPageDto,
            createdAt: new Date(),
            updatedAt: new Date(),
            imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
        });
        if (imageUrls.length > 0) {
            newPage.imageUrls = imageUrls;
        }
        if (newPage.images === undefined) {
            delete newPage.images;
        }
        console.log('Objeto a ser enviado ao Firestore:', newPage);
        const pageDocRef = this.collection
            .doc(category)
            .collection('items')
            .doc(id);
        await pageDocRef.set(newPage);
        return newPage;
    }
    async findAll(category) {
        const categoryCollection = this.collection.doc(category).collection('items');
        const snapshot = await categoryCollection.get();
        return snapshot.docs.map(doc => doc.data());
    }
    async findAllProjects() {
        const snapshot = await firebase_config_1.firestore
            .collection('pages/projects/items')
            .get();
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
    }
    async findOne(id, category) {
        const categoryCollection = this.collection.doc(category).collection('items');
        const doc = await categoryCollection.doc(id).get();
        if (!doc.exists) {
            throw new common_1.NotFoundException(`Página com ID ${id} não encontrada na categoria ${category}`);
        }
        return doc.data();
    }
    async update(id, updatePageDto, category) {
        console.log('Dados recebidos:', updatePageDto);
        const categoryCollection = this.collection.doc(category).collection('items');
        const docRef = categoryCollection.doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            throw new common_1.NotFoundException(`Página com ID ${id} não encontrada na categoria ${category}`);
        }
        const updated = { ...doc.data(), ...updatePageDto };
        await docRef.set(updated);
        return updated;
    }
    async remove(id, category) {
        const categoryCollection = this.collection.doc(category).collection('items');
        const docRef = categoryCollection.doc(id);
        const doc = await docRef.get();
        if (!doc.exists)
            return null;
        const data = doc.data();
        if (data?.imageUrls && Array.isArray(data.imageUrls)) {
            for (const url of data.imageUrls) {
                try {
                    const path = decodeURIComponent(url.split('/o/')[1].split('?')[0]);
                    await this.firebaseService.deleteFile(path);
                    console.log(`Imagem deletada: ${path}`);
                }
                catch (err) {
                    console.error(`Erro ao deletar imagem: ${url}`, err);
                }
            }
        }
        await docRef.delete();
        return { deleted: true };
    }
};
exports.PagesService = PagesService;
exports.PagesService = PagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService])
], PagesService);
function removeUndefinedFields(obj) {
    return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value !== undefined));
}
//# sourceMappingURL=pages.service.js.map