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
exports.ScheduleController = void 0;
const common_1 = require("@nestjs/common");
const schedule_service_1 = require("./schedule.service");
const create_schedule_dto_1 = require("./dto/create-schedule.dto/create-schedule.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const role_enum_1 = require("../auth/role.enum");
const roles_guard_1 = require("../auth/roles.guard");
let ScheduleController = class ScheduleController {
    scheduleService;
    constructor(scheduleService) {
        this.scheduleService = scheduleService;
    }
    create(dto) {
        return this.scheduleService.create(dto);
    }
    findAll() {
        return this.scheduleService.findAll();
    }
    async findConfirmedByMinistry(req) {
        if (!req.user || !req.user.userId) {
            throw new common_1.UnauthorizedException('Usuário não autenticado ou inválido');
        }
        const userId = req.user.userId;
        return this.scheduleService.findConfirmedByMinistry(userId);
    }
    async findAvailableByMyMinistry(req) {
        if (!req.user || !req.user.userId) {
            throw new common_1.UnauthorizedException('Usuário não autenticado ou inválido');
        }
        const userId = req.user.userId;
        return this.scheduleService.findAvailableByMinistry(userId);
    }
    findOne(id) {
        return this.scheduleService.findOne(id);
    }
    update(id, dto) {
        return this.scheduleService.update(id, dto);
    }
    remove(id) {
        return this.scheduleService.remove(id);
    }
    findByUser(userId) {
        return this.scheduleService.findByUser(userId);
    }
    findByUser2(userId) {
        return this.scheduleService.findByUser2(userId);
    }
    findAllAvailable() {
        return this.scheduleService.findAllAvailable();
    }
    findAllConfirmed() {
        return this.scheduleService.findAllConfirmed();
    }
};
exports.ScheduleController = ScheduleController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.VOLUNT, role_enum_1.Role.LIDER, role_enum_1.Role.COMUNIC),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_schedule_dto_1.CreateScheduleDto]),
    __metadata("design:returntype", void 0)
], ScheduleController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.LIDER),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScheduleController.prototype, "findAll", null);
__decorate([
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.LIDER),
    (0, common_1.Get)('confirmed/my-ministry'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "findConfirmedByMinistry", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('/available/my-ministry'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "findAvailableByMyMinistry", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ScheduleController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.VOLUNT, role_enum_1.Role.LIDER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_schedule_dto_1.CreateScheduleDto]),
    __metadata("design:returntype", void 0)
], ScheduleController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.VOLUNT, role_enum_1.Role.LIDER, role_enum_1.Role.COMUNIC),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ScheduleController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('/user/:userId'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.VOLUNT, role_enum_1.Role.LIDER, role_enum_1.Role.COMUNIC),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ScheduleController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Get)('/user/:userId/pending'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.VOLUNT, role_enum_1.Role.LIDER, role_enum_1.Role.COMUNIC),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ScheduleController.prototype, "findByUser2", null);
__decorate([
    (0, common_1.Get)('/available/all'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.VOLUNT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScheduleController.prototype, "findAllAvailable", null);
__decorate([
    (0, common_1.Get)('/confirmed/all'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN, role_enum_1.Role.VOLUNT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScheduleController.prototype, "findAllConfirmed", null);
exports.ScheduleController = ScheduleController = __decorate([
    (0, common_1.Controller)('schedules'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [schedule_service_1.ScheduleService])
], ScheduleController);
//# sourceMappingURL=schedule.controller.js.map