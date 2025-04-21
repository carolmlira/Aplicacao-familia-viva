import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Matches,
  IsEnum,
} from 'class-validator';
import { Role } from 'src/auth/role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string; // Nome completo do usuário

  @IsEmail()
  @IsNotEmpty()
  email: string; // E-mail do usuário (deve ser válido)

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string; // Senha do usuário (mínimo de 6 caracteres)

  @IsNotEmpty()
  @IsEnum(Role, { message: 'Nível de acesso inválido' })
  level: Role; // O Enum está em Auth.

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
