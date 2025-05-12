// auth.service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { randomBytes } from 'crypto';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException('Credenciais inválidas');
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.level,
      name: user.name,
      ministryId: user.ministryId,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async generateResetToken(email: string): Promise<string> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('Email Incorreto');

    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hora

    // Atualiza o usuário com o token de recuperação
    await this.usersService.updateResetToken(user.id, token, expires);

    return token;
  }

  async resetPassword(token: string, newPassword: string): Promise<string> {
    const user = await this.usersService.verifyResetToken(token);
    if (!user) {
      throw new NotFoundException('Token de redefinição inválido ou expirado');
    }

    // Atualiza a senha do usuário
    await this.usersService.update(user.id, { password: newPassword });

    // Limpa o token de reset após o uso
    await this.usersService.update(user.id, {
      resetToken: null,
      resetExpires: null,
    });

    return 'Senha redefinida com sucesso';
  }

  async sendResetEmail(email: string, token: string) {
    const link = `http://localhost:3001/redefinir-senha?token=${token}`;
    await this.emailService.sendMail(
      email,
      'Familia Viva, Recuperação de Senha',
      `Esse Link expira em 1h. Clique aqui para redefinir sua senha : ${link}`,
    );
  }
}
