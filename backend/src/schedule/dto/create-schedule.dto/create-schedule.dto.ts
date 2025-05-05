import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
<<<<<<< HEAD
<<<<<<< HEAD
import { ApiProperty } from '@nestjs/swagger';
=======

>>>>>>> 626a55d (Login e Auth do Front. Correção Usuarios e Auth do back)
=======
import { ApiProperty } from '@nestjs/swagger';
>>>>>>> 5a69e9e (Auth front, back e banco. Tabela de usuario(ADD,EDIT,Delet))
export class CreateScheduleDto {

  @ApiProperty({description: "id do ministerio"})
  @IsString()
  @IsOptional()
  @Length(0, 100)
  ministryId: string; // ID do ministério ao qual essa escala pertence
<<<<<<< HEAD
=======

  @ApiProperty({description: "id do user"})
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  userId: string; // ID do usuário responsável por essa escala
>>>>>>> 626a55d (Login e Auth do Front. Correção Usuarios e Auth do back)

<<<<<<< HEAD
  @ApiProperty({description: "id do user"})
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  userId: string; // ID do usuário responsável por essa escala

=======
>>>>>>> 5a69e9e (Auth front, back e banco. Tabela de usuario(ADD,EDIT,Delet))
  @ApiProperty({description: "Data"})
  @IsDateString()
  date: string; // Data da escala (formato ISO: YYYY-MM-DD)


<<<<<<< HEAD
<<<<<<< HEAD
  @ApiProperty({description: "Descrição"})
  @IsString()
  @IsOptional()
  @Length(0, 1000)
  description: string; // Descrição do que o usuário tem que fazer naquele dia
=======
=======
  @ApiProperty({description: "Descrição"})
>>>>>>> 5a69e9e (Auth front, back e banco. Tabela de usuario(ADD,EDIT,Delet))
  @IsString()
  @Length(3, 1000)
  description: string; // Descrição do que o usuário tem que fazer naquele dia

  @ApiProperty({description: "Disponibilidade"})
  @IsBoolean()
  available: boolean; // Se o usuário tem disponibilidade
>>>>>>> 626a55d (Login e Auth do Front. Correção Usuarios e Auth do back)

<<<<<<< HEAD
  @ApiProperty({description: "Disponibilidade"})
  @IsBoolean()
  available: boolean; // Se o usuário tem disponibilidade

=======
>>>>>>> 5a69e9e (Auth front, back e banco. Tabela de usuario(ADD,EDIT,Delet))
  @ApiProperty({description: "Confirmado"})
  @IsOptional()
  @IsBoolean()
  confirmed?: boolean; // Status indicando se a escala já foi confirmada pelos responsáveis

<<<<<<< HEAD
}
=======
<<<<<<< HEAD
}
=======
}
>>>>>>> 626a55d (Login e Auth do Front. Correção Usuarios e Auth do back)
>>>>>>> fddd392 (Login e Auth do Front. Correção Usuarios e Auth do back)
