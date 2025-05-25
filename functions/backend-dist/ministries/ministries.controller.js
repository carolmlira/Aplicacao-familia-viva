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
exports.MinistriesController = void 0;
const common_1 = require("@nestjs/common");
const ministries_service_1 = require("./ministries.service");
const create_ministry_dto_1 = require("./dto/create-ministry.dto/create-ministry.dto");
let MinistriesController = class MinistriesController {
    ministriesService;
    constructor(ministriesService) {
        this.ministriesService = ministriesService;
    }
    create(createMinistriesDto) {
        return this.ministriesService.create(createMinistriesDto);
    }
    findAll() {
        return this.ministriesService.findAll();
    }
    findOne(id) {
        return this.ministriesService.findOne(id);
    }
    update(id, updateMinistryDto) {
        return this.ministriesService.update(id, updateMinistryDto);
    }
    remove(id) {
        return this.ministriesService.remove(id);
    }
};
exports.MinistriesController = MinistriesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ministry_dto_1.CreateMinistriesDto]),
    __metadata("design:returntype", void 0)
], MinistriesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MinistriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MinistriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MinistriesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MinistriesController.prototype, "remove", null);
exports.MinistriesController = MinistriesController = __decorate([
    (0, common_1.Controller)('ministries'),
    __metadata("design:paramtypes", [ministries_service_1.MinistriesService])
], MinistriesController);
//# sourceMappingURL=ministries.controller.js.map