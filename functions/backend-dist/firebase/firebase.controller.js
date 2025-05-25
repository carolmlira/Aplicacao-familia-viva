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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const platform_express_2 = require("@nestjs/platform-express");
const firebase_service_1 = require("./firebase.service");
const uuid_1 = require("uuid");
let FirebaseController = class FirebaseController {
    firebaseService;
    constructor(firebaseService) {
        this.firebaseService = firebaseService;
    }
    async uploadMultipleFiles(files, category, pageId) {
        if (category === 'pages' && !pageId) {
            throw new common_1.BadRequestException('pageId é obrigatório para uploads na categoria "pages".');
        }
        const uploadResults = [];
        for (const file of files) {
            const ext = file.originalname.split('.').pop();
            const generatedId = (0, uuid_1.v4)();
            const filename = category === 'pages'
                ? `pages/${category}/${pageId}/${generatedId}.${ext}`
                : `${category}/${generatedId}.${ext}`;
            const url = await this.firebaseService.uploadFile(file, filename);
            uploadResults.push({ url, filename });
        }
        return uploadResults;
    }
    async uploadFile(file, category, pageId) {
        if (category === 'pages') {
            if (!pageId) {
                throw new common_1.BadRequestException('pageId é obrigatório para uploads na categoria "pages".');
            }
            const ext = file.originalname.split('.').pop();
            const generatedId = (0, uuid_1.v4)();
            const filename = `pages/${category}/${pageId}/${generatedId}.${ext}`;
            const url = await this.firebaseService.uploadFile(file, filename);
            return { url, filename };
        }
        const ext = file.originalname.split('.').pop();
        const generatedId = (0, uuid_1.v4)();
        const filename = `${category}/${generatedId}.${ext}`;
        const url = await this.firebaseService.uploadFile(file, filename);
        return { url, filename };
    }
    async uploadSobreImage(file) {
        const url = await this.firebaseService.uploadFile(file, 'sobre');
        return { url };
    }
    async uploadLogoImage(file) {
        const url = await this.firebaseService.uploadFile(file, 'logo');
        return { url };
    }
    async uploadUserImage(id, file) {
        const userData = await this.firebaseService.getUserById(id);
        if (userData?.filename) {
            await this.firebaseService.deleteFile(userData.filename);
        }
        const ext = file.originalname.split('.').pop();
        const filename = `user/${id}/${(0, uuid_1.v4)()}.${ext}`;
        const url = await this.firebaseService.uploadFile(file, filename);
        await this.firebaseService.updateUserImage(id, url, filename);
        return { url };
    }
    async getFile(filename) {
        const url = await this.firebaseService.getFileUrl(filename);
        return { url };
    }
    async updateFile(file, category, subgrup, filename, newName, pageId) {
        if (!category || !filename || !newName) {
            throw new common_1.BadRequestException('Categoria, filename e newName são obrigatórios.');
        }
        let oldPath;
        let newPath;
        if (category === 'pages') {
            if (!pageId) {
                throw new common_1.BadRequestException('pageId é obrigatório para categoria "pages".');
            }
            oldPath = `pages/${subgrup}/${pageId}/${filename}`;
            newPath = `pages/${subgrup}/${pageId}/${newName}`;
        }
        else {
            oldPath = `${category}/${filename}`;
            newPath = `${category}/${newName}`;
        }
        await this.firebaseService.deleteFile(oldPath);
        const url = await this.firebaseService.uploadFile(file, newPath);
        return { url };
    }
    async getLogoUrl() {
        const url = await this.firebaseService.getFileUrl('logo');
        return { url };
    }
    async getPagesByCategory(category) {
        if (!category) {
            throw new common_1.BadRequestException('Categoria não informada');
        }
        const snapshot = await this.firebaseService.getCollectionByPath(`pages/${category}/items`);
        const pages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return { pages };
    }
    async deleteFileGeneric(category, subgrup, filename, pageId) {
        if (!category || !filename) {
            throw new common_1.BadRequestException('Parâmetros obrigatórios: category e filename');
        }
        let fullPath;
        console.log(`category: ${category}, subgrup: ${subgrup}, pageId: ${pageId}, filename: ${filename}`);
        if (subgrup && pageId) {
            fullPath = `${category}/${subgrup}/${pageId}/${filename}`;
        }
        else if (subgrup) {
            fullPath = `${category}/${subgrup}/${filename}`;
        }
        else if (pageId) {
            fullPath = `${category}/${filename}`;
        }
        else {
            fullPath = `${category}/${filename}`;
        }
        console.log(`Caminho completo do arquivo a ser deletado: ${fullPath}`);
        try {
            await this.firebaseService.deleteFile(fullPath);
            return { message: `Arquivo ${fullPath} deletado com sucesso.` };
        }
        catch (error) {
            console.error(`Erro ao deletar arquivo: ${error.message}`);
            throw new common_1.BadRequestException(`Erro ao deletar arquivo: ${error.message}`);
        }
    }
    async delete(filename) {
        return this.firebaseService.deleteFile(filename);
    }
    async deleteFolder(category, subgrup, pageId) {
        if (!category || !subgrup || !pageId) {
            throw new common_1.BadRequestException('category, subgrup e pageId são obrigatórios.');
        }
        const folderPath = `${category}/${subgrup}/${pageId}`;
        await this.firebaseService.deleteFolder(folderPath);
        return { message: `Pasta ${folderPath} deletada com sucesso.` };
    }
    async listFiles(category) {
        const prefix = `${category}/`;
        const files = await this.firebaseService.listFiles(prefix);
        return { files };
    }
    async getPageFilesByCategory(category, pageId) {
        if (!pageId) {
            throw new common_1.BadRequestException('pageId não informado');
        }
        const urls = await this.firebaseService.listFilesInPage(pageId, category);
        return { files: urls };
    }
};
exports.FirebaseController = FirebaseController;
__decorate([
    (0, common_1.Post)('upload-gallery'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files')),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Query)('category')),
    __param(2, (0, common_1.Query)('pageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String, String]),
    __metadata("design:returntype", Promise)
], FirebaseController.prototype, "uploadMultipleFiles", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_2.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Query)('category')),
    __param(2, (0, common_1.Query)('pageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], FirebaseController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Post)('upload/sobre'),
    (0, common_1.UseInterceptors)((0, platform_express_2.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FirebaseController.prototype, "uploadSobreImage", null);
__decorate([
    (0, common_1.Post)('upload/logo'),
    (0, common_1.UseInterceptors)((0, platform_express_2.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FirebaseController.prototype, "uploadLogoImage", null);
__decorate([
    (0, common_1.Post)('upload/user/:id'),
    (0, common_1.UseInterceptors)((0, platform_express_2.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FirebaseController.prototype, "uploadUserImage", null);
__decorate([
    (0, common_1.Get)('file/:filename'),
    __param(0, (0, common_1.Param)('filename')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FirebaseController.prototype, "getFile", null);
__decorate([
    (0, common_1.Put)('update'),
    (0, common_1.UseInterceptors)((0, platform_express_2.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Query)('category')),
    __param(2, (0, common_1.Query)('subgrup')),
    __param(3, (0, common_1.Query)('filename')),
    __param(4, (0, common_1.Query)('newName')),
    __param(5, (0, common_1.Query)('pageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], FirebaseController.prototype, "updateFile", null);
__decorate([
    (0, common_1.Get)('logo'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FirebaseController.prototype, "getLogoUrl", null);
__decorate([
    (0, common_1.Get)('pages'),
    __param(0, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FirebaseController.prototype, "getPagesByCategory", null);
__decorate([
    (0, common_1.Delete)('delete'),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('subgrup')),
    __param(2, (0, common_1.Query)('filename')),
    __param(3, (0, common_1.Query)('pageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], FirebaseController.prototype, "deleteFileGeneric", null);
__decorate([
    (0, common_1.Delete)('delete-gallery'),
    __param(0, (0, common_1.Query)('filename')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FirebaseController.prototype, "delete", null);
__decorate([
    (0, common_1.Delete)('delete-folder'),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Query)('subgrup')),
    __param(2, (0, common_1.Query)('pageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], FirebaseController.prototype, "deleteFolder", null);
__decorate([
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FirebaseController.prototype, "listFiles", null);
__decorate([
    (0, common_1.Get)('pages/:category/files'),
    __param(0, (0, common_1.Param)('category')),
    __param(1, (0, common_1.Query)('pageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FirebaseController.prototype, "getPageFilesByCategory", null);
exports.FirebaseController = FirebaseController = __decorate([
    (0, common_1.Controller)('firebase'),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService])
], FirebaseController);
//# sourceMappingURL=firebase.controller.js.map