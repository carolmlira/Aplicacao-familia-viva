import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  level: string; // Pode ser validado como enum depois, se desejar

  @IsBoolean()
  active: boolean;

  @IsOptional()
  @IsString()
  photo?: string; // Pode ser uma URL

  @IsOptional()
  @Matches(/^\+\d{1,3}\d{7,14}$/, {
    message: 'O número de telefone deve estar no formato internacional, exemplo: +5511999999999',
  })
  phone?: string;

  @IsBoolean()
  whatsappOptIn: boolean;
}


