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
exports.BannerService = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../firebase/firebase.service");
const firebase_config_1 = require("../config/firebase.config");
const uuid_1 = require("uuid");
let BannerService = class BannerService {
    firebaseService;
    collection = firebase_config_1.firestore.collection('banner');
    constructor(firebaseService) {
        this.firebaseService = firebaseService;
    }
    async create(files, dto) {
        if (!files.imagemLogo || !files.imagemBanner) {
            throw new common_1.BadRequestException('Ambas as imagens são obrigatórias');
        }
        const logoFilename = `banner/${(0, uuid_1.v4)()}-${files.imagemLogo.originalname}`;
        const bannerFilename = `banner/${(0, uuid_1.v4)()}-${files.imagemBanner.originalname}`;
        const logoUrl = await this.firebaseService.uploadFile(files.imagemLogo, logoFilename);
        const bannerUrl = await this.firebaseService.uploadFile(files.imagemBanner, bannerFilename);
        const data = {
            frase: dto.frase,
            imagemLogo: logoUrl,
            imagemBanner: bannerUrl,
            createdAt: new Date(),
        };
        const docRef = await this.collection.add(data);
        return { id: docRef.id, ...data };
    }
    async findOne() {
        const snapshot = await this.collection.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    async update(id, files, dto) {
        const docRef = this.collection.doc(id);
        const docSnap = await docRef.get();
        if (!docSnap.exists) {
            throw new common_1.BadRequestException('Banner não encontrado');
        }
        const banner = docSnap.data();
        if (!banner) {
            throw new common_1.BadRequestException('Dados do banner não encontrados');
        }
        const updateData = {};
        if (files.imagemLogo) {
            if (banner.imagemLogo) {
                await this.firebaseService.deleteFileByUrl(banner.imagemLogo);
            }
            const logoFilename = `banner/${(0, uuid_1.v4)()}-${files.imagemLogo.originalname}`;
            updateData.imagemLogo = await this.firebaseService.uploadFile(files.imagemLogo, logoFilename);
        }
        if (files.imagemBanner) {
            if (banner.imagemBanner) {
                await this.firebaseService.deleteFileByUrl(banner.imagemBanner);
            }
            const bannerFilename = `banner/${(0, uuid_1.v4)()}-${files.imagemBanner.originalname}`;
            updateData.imagemBanner = await this.firebaseService.uploadFile(files.imagemBanner, bannerFilename);
        }
        if (dto.frase !== undefined) {
            updateData.frase = dto.frase;
        }
        updateData.updatedAt = new Date();
        await docRef.update(updateData);
        return { id, ...banner, ...updateData };
    }
};
exports.BannerService = BannerService;
exports.BannerService = BannerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService])
], BannerService);
//# sourceMappingURL=banner.service.js.map