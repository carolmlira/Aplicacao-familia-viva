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
exports.SobreController = void 0;
const common_1 = require("@nestjs/common");
const sobre_service_1 = require("./sobre.service");
const create_sobre_1 = require("./dto/create-sobre.dto/create-sobre");
const update_sobre_1 = require("./dto/update-sobre.dto/update-sobre");
const file_interceptor_1 = require("../firebase/file.interceptor");
let SobreController = class SobreController {
    sobreService;
    constructor(sobreService) {
        this.sobreService = sobreService;
    }
    async create(file, body) {
        return this.sobreService.create(body, file ? [file] : []);
    }
    async update(id, file, body) {
        return this.sobreService.update(id, body, file);
    }
    async findAll() {
        return this.sobreService.findAll();
    }
    async remove(id) {
        return this.sobreService.remove(id);
    }
};
exports.SobreController = SobreController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)(new file_interceptor_1.FileInterceptor('imagem')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_sobre_1.CreateSobre]),
    __metadata("design:returntype", Promise)
], SobreController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseInterceptors)(new file_interceptor_1.FileInterceptor('imagemSobre', 1, {
        limits: {
            fileSize: 2 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_sobre_1.UpdateSobre]),
    __metadata("design:returntype", Promise)
], SobreController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SobreController.prototype, "findAll", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SobreController.prototype, "remove", null);
exports.SobreController = SobreController = __decorate([
    (0, common_1.Controller)('sobre'),
    __metadata("design:paramtypes", [sobre_service_1.SobreService])
], SobreController);
//# sourceMappingURL=sobre.controller.js.map