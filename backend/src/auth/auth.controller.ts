// auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Valida a rota de login
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    console.log('Usuário validado:', user); // ⬅️ ADICIONE ISSO
    return this.authService.login(user);
  }


  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    const token = await this.authService.generateResetToken(body.email);
    await this.authService.sendResetEmail(body.email, token);
    return { message: 'Link enviado para o e-mail.' };
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: { token: string; password: string }) {
    await this.authService.resetPassword(dto.token, dto.password);
    return { message: 'Senha atualizada com sucesso.' };
  }
}
