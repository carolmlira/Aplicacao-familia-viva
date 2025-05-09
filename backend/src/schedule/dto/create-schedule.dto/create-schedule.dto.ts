import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateScheduleDto {

  @ApiProperty({description: "id do ministerio"})
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  ministryId: string; // ID do ministério ao qual essa escala pertence

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

  @ApiProperty({description: "Descrição"})
  @IsString()
  @Length(3, 1000)
  description: string; // Descrição do que o usuário tem que fazer naquele dia

  @ApiProperty({description: "Disponibilidade"})
  @IsBoolean()
  available: boolean; // Se o usuário tem disponibilidade

  @ApiProperty({description: "Confirmado"})
  @IsOptional()
  @IsBoolean()
  confirmed?: boolean; // Status indicando se a escala já foi confirmada pelos responsáveis

}