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
exports.PagesController = void 0;
const common_1 = require("@nestjs/common");
const pages_service_1 = require("./pages.service");
const create_page_dto_1 = require("./dto/create-page.dto/create-page.dto");
const update_page_dto_1 = require("./dto/update-page.dto/update-page.dto");
const platform_express_1 = require("@nestjs/platform-express");
let PagesController = class PagesController {
    pagesService;
    constructor(pagesService) {
        this.pagesService = pagesService;
    }
    create(category, images, createPageDto) {
        return this.pagesService.create(createPageDto, category, images);
    }
    async findAll(category) {
        const pages = await this.pagesService.findAll(category);
        return { pages };
    }
    findOne(category, id) {
        return this.pagesService.findOne(id, category);
    }
    async findProjects() {
        return this.pagesService.findAllProjects();
    }
    update(category, id, updatePageDto) {
        return this.pagesService.update(id, updatePageDto, category);
    }
    remove(category, id) {
        return this.pagesService.remove(id, category);
    }
};
exports.PagesController = PagesController;
__decorate([
    (0, common_1.Post)(':category'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images')),
    __param(0, (0, common_1.Param)('category')),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, create_page_dto_1.CreatePageDto]),
    __metadata("design:returntype", void 0)
], PagesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PagesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':category/:id'),
    __param(0, (0, common_1.Param)('category')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PagesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('projects'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PagesController.prototype, "findProjects", null);
__decorate([
    (0, common_1.Patch)(':category/:id'),
    __param(0, (0, common_1.Param)('category')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_page_dto_1.UpdatePageDto]),
    __metadata("design:returntype", void 0)
], PagesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':category/:id'),
    __param(0, (0, common_1.Param)('category')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PagesController.prototype, "remove", null);
exports.PagesController = PagesController = __decorate([
    (0, common_1.Controller)('pages'),
    __metadata("design:paramtypes", [pages_service_1.PagesService])
], PagesController);
//# sourceMappingURL=pages.controller.js.map