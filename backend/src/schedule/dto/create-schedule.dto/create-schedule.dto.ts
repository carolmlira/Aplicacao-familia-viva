import {
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
  @IsOptional()
  @Length(0, 100)
  ministryId: string; // ID do ministério ao qual essa escala pertence

  @ApiProperty({description: "id do user"})
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  userId: string; // ID do usuário responsável por essa escala

  @ApiProperty({description: "Data"})
  @IsDateString()
  date: string; // Data da escala (formato ISO: YYYY-MM-DD)


  @ApiProperty({description: "Descrição"})
  @IsString()
  @IsOptional()
  @Length(0, 1000)
  description: string; // Descrição do que o usuário tem que fazer naquele dia

  @ApiProperty({description: "Disponibilidade"})
  @IsBoolean()
  available: boolean; // Se o usuário tem disponibilidade

  @ApiProperty({description: "Confirmado"})
  @IsOptional()
  @IsBoolean()
  confirmed?: boolean; // Status indicando se a escala já foi confirmada pelos responsáveis

  @ApiProperty({description: "Horário"})
  @IsOptional()
  time?: Date;
}
