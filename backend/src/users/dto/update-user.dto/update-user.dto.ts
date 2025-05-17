// update-user.dto.ts
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  Matches,
  IsEnum,
  Length,
} from 'class-validator';

import { Role } from 'src/auth/role.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'O email deve ser válido' })
  email?: string;

  @IsOptional()
  @IsString()
  oldSenha?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password?: string;

  @IsOptional()
  @IsEnum(Role)
  level?: Role;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @Matches(/^\+\d{1,3}\d{7,14}$/)
  phone?: string;

  @IsOptional()
  @IsBoolean()
  whatsappOptIn?: boolean;

  @IsOptional()
  @IsString()
  @Length(3, 100)
  ministryId?: string;

  @IsOptional()
  @IsString()
  resetToken?: string | null;

  @IsOptional()
  @IsString()
  resetExpires?: string | null;
}
