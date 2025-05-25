"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinistriesService = void 0;
const common_1 = require("@nestjs/common");
const firebase_config_1 = require("../config/firebase.config");
const uuid_1 = require("uuid");
let MinistriesService = class MinistriesService {
    collection = firebase_config_1.firestore.collection('ministries');
    async create(createMinistriesDto) {
        const newMinistry = {
            id: (0, uuid_1.v4)(),
            ...createMinistriesDto,
        };
        await this.collection.doc(newMinistry.id).set(newMinistry);
        return newMinistry;
    }
    async findAll() {
        const snapshot = await this.collection.get();
        return snapshot.docs.map((doc) => doc.data());
    }
    async findOne(id) {
        const doc = await this.collection.doc(id).get();
        if (!doc.exists) {
            throw new common_1.NotFoundException('Ministério não encontrado');
        }
        return doc.data();
    }
    async update(id, updateData) {
        const docRef = this.collection.doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            throw new common_1.NotFoundException('Ministério não encontrado');
        }
        const updated = { ...doc.data(), ...updateData };
        await docRef.set(updated);
        return updated;
    }
    async remove(id) {
        const doc = await this.collection.doc(id).get();
        if (!doc.exists) {
            throw new common_1.NotFoundException('Ministério não encontrado');
        }
        await this.collection.doc(id).delete();
        return { message: 'Ministério removido com sucesso' };
    }
};
exports.MinistriesService = MinistriesService;
exports.MinistriesService = MinistriesService = __decorate([
    (0, common_1.Injectable)()
], MinistriesService);
//# sourceMappingURL=ministries.service.js.map