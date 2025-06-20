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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const crypto_1 = require("crypto");
const email_service_1 = require("../email/email.service");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    usersService;
    jwtService;
    emailService;
    constructor(usersService, jwtService, emailService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (!user)
            throw new common_1.UnauthorizedException('Usuário não encontrado');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            throw new common_1.UnauthorizedException('Senha incorreta');
        const { password: _, ...result } = user;
        return result;
    }
    async login(user) {
        const payload = {
            email: user.email,
            sub: user.id,
            role: user.level,
            name: user.name,
            ministryId: user.ministryId,
            photoURL: user.photoURL,
        };
        return {
            access_token: this.jwtService.sign(payload),
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.level,
            ministryId: user.ministryId,
            photoURL: user.photoURL,
        };
    }
    async generateResetToken(email) {
        const user = await this.usersService.findByEmail(email);
        if (!user)
            throw new common_1.NotFoundException('Usuário não encontrado');
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        const expires = new Date(Date.now() + 3600000);
        await this.usersService.updateResetToken(user.id, token, expires);
        return token;
    }
    async resetPassword(token, newPassword) {
        const user = await this.usersService.verifyResetToken(token);
        if (!user) {
            throw new common_1.NotFoundException('Token de redefinição inválido ou expirado');
        }
        await this.usersService.update(user.id, { password: newPassword });
        await this.usersService.update(user.id, {
            resetToken: null,
            resetExpires: null,
        });
        return 'Senha redefinida com sucesso';
    }
    async sendResetEmail(email, token) {
        const link = `https://familia-viva-recife-7xc53kzq6a-uc.a.run.app/redefinir-senha?token=${token}`;
        await this.emailService.sendMail(email, 'Familia Viva, Recuperação de Senha', `Esse Link expira em 1h. Clique aqui para redefinir sua senha : ${link}`);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map