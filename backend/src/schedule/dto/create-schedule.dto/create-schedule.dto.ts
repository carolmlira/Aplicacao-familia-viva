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

  @IsDateString()
  date: string; // Data da escala (formato ISO: YYYY-MM-DD)

  @IsArray()
  @IsString({ each: true })
  @Length(3, 100, { each: true })
  members: string[]; // Lista de membros (IDs ou nomes) escalados para esse dia

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  notes?: string; // Notas adicionais da escala (ex: observações para os voluntários)

  @IsOptional()
  @IsBoolean()
  confirmed?: boolean; // Status indicando se a escala já foi confirmada pelos responsáveis
}
