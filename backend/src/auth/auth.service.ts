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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.level,
      name: user.name,
      ministryId: user.ministryId,
    };

=======
=======
>>>>>>> 8f12c0c (Auth front, back e banco. Tabela de usuario(ADD,EDIT,Delet))
=======
>>>>>>> 47f7474 (Correção Telas, Implem Escala, Exceções em Usuarios)
=======
>>>>>>> 0594157 (Recuperação de senha, Module Email, Correções telas)
<<<<<<< HEAD
    const payload = { email: user.email, sub: user.id, role: user.level, name: user.name };
=======
    const payload = { email: user.email, sub: user.id, role: user.level, name: user.name, ministryId: user.ministryId };
>>>>>>> 5f138ea (Correção Telas, Implem Escala, Exceções em Usuarios)
   
=======
    const payload = { email: user.email, sub: user.id, role: user.role };
>>>>>>> 626a55d (Login e Auth do Front. Correção Usuarios e Auth do back)
<<<<<<< HEAD
>>>>>>> fddd392 (Login e Auth do Front. Correção Usuarios e Auth do back)
=======
=======
    const payload = { email: user.email, sub: user.id, role: user.level, name: user.name };
   
>>>>>>> 5a69e9e (Auth front, back e banco. Tabela de usuario(ADD,EDIT,Delet))
<<<<<<< HEAD
>>>>>>> 8f12c0c (Auth front, back e banco. Tabela de usuario(ADD,EDIT,Delet))
    return {
      access_token: this.jwtService.sign(payload),
    };
=======
=======
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.level,
      name: user.name,
      ministryId: user.ministryId,
    };

>>>>>>> 0efbb5e (Recuperação de senha, Module Email, Correções telas)
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async generateResetToken(email: string): Promise<string> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('Usuário não encontrado');

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
>>>>>>> 0594157 (Recuperação de senha, Module Email, Correções telas)
  }

  async generateResetToken(email: string): Promise<string> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('Usuário não encontrado');

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