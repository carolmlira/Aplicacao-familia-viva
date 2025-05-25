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
exports.CreateScheduleDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateScheduleDto {
    ministryId;
    userId;
    date;
    description;
    available;
    confirmed;
}
exports.CreateScheduleDto = CreateScheduleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "id do ministerio" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(0, 100),
    __metadata("design:type", String)
], CreateScheduleDto.prototype, "ministryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "id do user" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Length)(3, 100),
    __metadata("design:type", String)
], CreateScheduleDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Data" }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateScheduleDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Descrição" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(0, 1000),
    __metadata("design:type", String)
], CreateScheduleDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Disponibilidade" }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateScheduleDto.prototype, "available", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Confirmado" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateScheduleDto.prototype, "confirmed", void 0);
//# sourceMappingURL=create-schedule.dto.js.map