"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const firebase_config_1 = require("../config/firebase.config");
const uuid_1 = require("uuid");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    collection = firebase_config_1.firestore.collection('users');
    async create(createUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const safeUserDto = createUserDto;
        const newUser = {
            id: (0, uuid_1.v4)(),
            ...safeUserDto,
            password: hashedPassword,
        };
        await this.collection.doc(newUser.id).set(newUser);
        return newUser;
    }
    async findAll() {
        const snapshot = await this.collection.get();
        return snapshot.docs.map((doc) => doc.data());
    }
    async findOne(id) {
        const doc = await this.collection.doc(id).get();
        if (!doc.exists) {
            throw new common_1.NotFoundException(`Usuário com ID ${id} não encontrado`);
        }
        return doc.data();
    }
    async findByEmail(email) {
        const snapshot = await this.collection.where('email', '==', email).get();
        if (snapshot.empty)
            return undefined;
        return snapshot.docs[0].data();
    }
    async update(id, updateUserDto) {
        const docRef = this.collection.doc(id);
        const doc = await docRef.get();
        if (!doc.exists) {
            throw new common_1.NotFoundException(`Usuário com ID ${id} não encontrado`);
        }
        const userData = doc.data();
        if (updateUserDto.password) {
            const newHash = await bcrypt.hash(updateUserDto.password, 10);
            updateUserDto.password = newHash;
        }
        const { oldSenha, ...dataToUpdate } = updateUserDto;
        const updatedData = {
            ...userData,
            ...dataToUpdate,
        };
        await docRef.update(updatedData);
        return updatedData;
    }
    async updateResetToken(id, token, expires) {
        return await this.collection.doc(id).update({
            resetToken: token,
            resetExpires: expires.toISOString(),
        });
    }
    async verifyResetToken(token) {
        const snapshot = await this.collection
            .where('resetToken', '==', token)
            .get();
        if (snapshot.empty) {
            return null;
        }
        const userDoc = snapshot.docs[0];
        const user = userDoc.data();
        if (!user.resetExpires) {
            return null;
        }
        const expiresAt = new Date(user.resetExpires);
        if (isNaN(expiresAt.getTime()) || expiresAt < new Date()) {
            return null;
        }
        return user;
    }
    async remove(id) {
        const doc = await this.collection.doc(id).get();
        if (!doc.exists)
            return { deleted: false };
        await this.collection.doc(id).delete();
        return { deleted: true };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)()
], UsersService);
//# sourceMappingURL=users.service.js.map