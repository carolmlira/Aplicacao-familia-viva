import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string; // Nome completo do usuário

  @IsEmail()
  email: string; // E-mail do usuário (deve ser válido)

  @IsString()
  @MinLength(6)
  password: string; // Senha do usuário (mínimo de 6 caracteres)

  @IsString()
  @IsNotEmpty()
  level: string; // Nível de acesso (ex: "admin", "comunicacao", "voluntario") — pode ser enum futuramente

  @IsBoolean()
  active: boolean; // Indica se o usuário está ativo no sistema

  @IsOptional()
  @IsString()
  photo?: string; // URL da foto de perfil do usuário (opcional)

  @IsOptional()
  @Matches(/^\+\d{1,3}\d{7,14}$/, {
    message: 'O número de telefone deve estar no formato internacional, exemplo: +5511999999999',
  })
  phone?: string; // Telefone no formato internacional, com DDI e DDD (opcional)

  @IsBoolean()
  whatsappOptIn: boolean; // Indica se o usuário aceita receber comunicações via WhatsApp
}
