import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateScheduleDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  ministryId: string; // ID do ministério ao qual essa escala pertence

  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  userId: string; // ID do usuário responsável por essa escala

  @IsDateString()
  date: string; // Data da escala (formato ISO: YYYY-MM-DD)

  @IsArray()
  @IsString({ each: true })
  @Length(3, 100, { each: true })
  members: string[]; // Lista de membros (IDs ou nomes) escalados para esse dia

  @IsString()
  @Length(3, 1000)
  description: string; // Descrição do que o usuário tem que fazer naquele dia

  @IsBoolean()
  available: boolean; // Se o usuário tem disponibilidade

  @IsOptional()
  @IsBoolean()
  confirmed?: boolean; // Status indicando se a escala já foi confirmada pelos responsáveis

}