import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    // Verificar se as variáveis de ambiente estão definidas
    if (!emailUser || !emailPass) {
      throw new InternalServerErrorException(
        'Credenciais de e-mail não configuradas',
      );
    }

    const emailService = emailUser.split('@')[1]; // Extrair o domínio do e-mail

    // Configuração do transporter baseada no domínio do e-mail
    if (emailService === 'gmail.com') {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });
    } else if (
      emailService === 'outlook.com' ||
      emailService === 'hotmail.com'
    ) {
      this.transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false, // Usando STARTTLS
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });
    } else {
      throw new InternalServerErrorException('Serviço de e-mail não suportado');
    }
  }

  async sendMail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email enviado com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      throw new InternalServerErrorException('Erro ao enviar e-mail');
    }
  }
}
