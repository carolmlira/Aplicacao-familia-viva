import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
<<<<<<< HEAD
import { ApiProperty } from '@nestjs/swagger';
=======

>>>>>>> 626a55d (Login e Auth do Front. Correção Usuarios e Auth do back)
export class CreateScheduleDto {

  @ApiProperty({description: "id do ministerio"})
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  ministryId: string; // ID do ministério ao qual essa escala pertence
<<<<<<< HEAD
=======

  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  userId: string; // ID do usuário responsável por essa escala
>>>>>>> 626a55d (Login e Auth do Front. Correção Usuarios e Auth do back)

  @ApiProperty({description: "id do user"})
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  userId: string; // ID do usuário responsável por essa escala

  @ApiProperty({description: "Data"})
  @IsDateString()
  date: string; // Data da escala (formato ISO: YYYY-MM-DD)

  @ApiProperty({description: "membros"})
  @IsArray()
  @IsString({ each: true })
  @Length(3, 100, { each: true })
  members: string[]; // Lista de membros (IDs ou nomes) escalados para esse dia

<<<<<<< HEAD
  @ApiProperty({description: "Descrição"})
  @IsString()
  @Length(3, 1000)
  description: string; // Descrição do que o usuário tem que fazer naquele dia
=======
  @IsString()
  @Length(3, 1000)
  description: string; // Descrição do que o usuário tem que fazer naquele dia

  @IsBoolean()
  available: boolean; // Se o usuário tem disponibilidade
>>>>>>> 626a55d (Login e Auth do Front. Correção Usuarios e Auth do back)

  @ApiProperty({description: "Disponibilidade"})
  @IsBoolean()
  available: boolean; // Se o usuário tem disponibilidade

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
