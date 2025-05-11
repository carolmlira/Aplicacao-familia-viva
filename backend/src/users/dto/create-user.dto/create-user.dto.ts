import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Matches,
  IsEnum,
<<<<<<< HEAD
<<<<<<< HEAD
  Length,
  IsEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
=======
} from 'class-validator';
>>>>>>> 626a55d (Login e Auth do Front. Correção Usuarios e Auth do back)
=======
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
>>>>>>> 5a69e9e (Auth front, back e banco. Tabela de usuario(ADD,EDIT,Delet))
import { Role } from 'src/auth/role.enum';

export class CreateUserDto {
  @ApiProperty({ description: 'O nome do Usuario' })
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name: string; // Nome completo do usuário

  @ApiProperty({ description: 'O Email do Usuario' })
  @IsEmail({}, { message: 'O email deve ser válido' })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  email: string; // E-mail do usuário (deve ser válido)

  @ApiProperty({ description: 'A senha do do Usuario' })
  @IsString({ message: 'A senha deve ser uma string' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password: string; // Senha do usuário (mínimo de 6 caracteres)
<<<<<<< HEAD
=======

  @ApiProperty({ description: 'A role do Usuario' })
  @IsNotEmpty()
  @IsEnum(Role, { message: 'Nível de acesso inválido' })
  level: Role; // O Enum está em Auth.
>>>>>>> 626a55d (Login e Auth do Front. Correção Usuarios e Auth do back)

<<<<<<< HEAD
<<<<<<< HEAD
  @ApiProperty({ description: 'A role do Usuario' })
=======
=======
>>>>>>> 47f7474 (Correção Telas, Implem Escala, Exceções em Usuarios)
<<<<<<< HEAD
  @ApiProperty({description: "A role do Usuario"})
>>>>>>> 8f12c0c (Auth front, back e banco. Tabela de usuario(ADD,EDIT,Delet))
  @IsNotEmpty()
  @IsEnum(Role, { message: 'Nível de acesso inválido' })
  level: Role; // O Enum está em Auth.

<<<<<<< HEAD
  @ApiProperty({ description: 'Se está ativo do Usuario' })
=======
=======
>>>>>>> 5a69e9e (Auth front, back e banco. Tabela de usuario(ADD,EDIT,Delet))
  @ApiProperty({description: "Se está ativo do Usuario"})
<<<<<<< HEAD
>>>>>>> 8f12c0c (Auth front, back e banco. Tabela de usuario(ADD,EDIT,Delet))
=======
=======
  @ApiProperty({ description: 'Se está ativo do Usuario' })
>>>>>>> 5f138ea (Correção Telas, Implem Escala, Exceções em Usuarios)
>>>>>>> 47f7474 (Correção Telas, Implem Escala, Exceções em Usuarios)
  @IsBoolean()
  active: boolean; // Indica se o usuário está ativo no sistema

  @ApiProperty({ description: 'Photo do Usuario' })
  @IsOptional()
  @IsString()
  photo?: string; // URL da foto de perfil do usuário (opcional)

  @ApiProperty({ description: 'O Numero do Usuario' })
  @Matches(/^\+\d{1,3}\d{7,14}$/, {
    message:
      'O número de telefone deve estar no formato internacional, exemplo: +5511999999999',
  })
  phone?: string; // Telefone no formato internacional, com DDI e DDD (opcional)

  @ApiProperty({ description: 'Notificao wpp do Usuario' })
  @IsBoolean()
  whatsappOptIn: boolean; // Indica se o usuário aceita receber comunicações via WhatsApp
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 5a69e9e (Auth front, back e banco. Tabela de usuario(ADD,EDIT,Delet))

  @ApiProperty({ description: 'id do ministerio' })
  @IsString()
  @Length(3, 100)
<<<<<<< HEAD
  ministryId: string;
=======
<<<<<<< HEAD
  ministryId: string; 
>>>>>>> 47f7474 (Correção Telas, Implem Escala, Exceções em Usuarios)

<<<<<<< HEAD
<<<<<<< HEAD
  //Tokens para usuario alterar sua senha.
  @ApiProperty({ description: 'Token de reset' })
  @IsOptional()
  @IsString()
  resetToken?: string | null;

  @ApiProperty({ description: 'Data de expiração do reset' })
  @IsOptional()
  @IsString()
  resetExpires?: string | null;
}
=======
=======
>>>>>>> 8f12c0c (Auth front, back e banco. Tabela de usuario(ADD,EDIT,Delet))
=======
>>>>>>> 626a55d (Login e Auth do Front. Correção Usuarios e Auth do back)
=======
>>>>>>> 5a69e9e (Auth front, back e banco. Tabela de usuario(ADD,EDIT,Delet))
=======
  ministryId: string;
<<<<<<< HEAD
>>>>>>> 5f138ea (Correção Telas, Implem Escala, Exceções em Usuarios)
=======

  //Tokens para usuario alterar sua senha.
  @ApiProperty({ description: 'Token de reset' })
  @IsOptional()
  @IsString()
  resetToken?: string | null;

  @ApiProperty({ description: 'Data de expiração do reset' })
  @IsOptional()
  @IsString()
  resetExpires?: string | null;
>>>>>>> 0efbb5e (Recuperação de senha, Module Email, Correções telas)
}
>>>>>>> fddd392 (Login e Auth do Front. Correção Usuarios e Auth do back)
