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
exports.CreateUserDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const role_enum_1 = require("../../../auth/role.enum");
class CreateUserDto {
    name;
    email;
    password;
    level;
    active;
    photoURL;
    phone;
    ministryId;
    resetToken;
    resetExpires;
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'O nome do Usuario' }),
    (0, class_validator_1.IsString)({ message: 'O nome deve ser uma string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O nome é obrigatório' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'O Email do Usuario' }),
    (0, class_validator_1.IsEmail)({}, { message: 'O email deve ser válido' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O email é obrigatório' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'A senha do do Usuario' }),
    (0, class_validator_1.IsString)({ message: 'A senha deve ser uma string' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'A senha é obrigatória' }),
    (0, class_validator_1.MinLength)(6, { message: 'A senha deve ter no mínimo 6 caracteres' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'A role do Usuario' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(role_enum_1.Role, { message: 'Nível de acesso inválido' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Se está ativo do Usuario' }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateUserDto.prototype, "active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'photo com URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "photoURL", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'O Numero do Usuario' }),
    (0, class_validator_1.Matches)(/^\+\d{1,3}\d{7,14}$/, {
        message: 'O número de telefone deve estar no formato internacional, exemplo: +5511999999999',
    }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'id do ministerio' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 100),
    __metadata("design:type", String)
], CreateUserDto.prototype, "ministryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Token de reset' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateUserDto.prototype, "resetToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Data de expiração do reset' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateUserDto.prototype, "resetExpires", void 0);
//# sourceMappingURL=create-user.dto.js.map