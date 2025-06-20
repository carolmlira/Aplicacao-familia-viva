import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateScheduleDto {
  @ApiProperty({ description: 'id do ministerio' })
  @IsString()
  @IsOptional()
  @Length(0, 100)
  ministryId: string; // ID do ministério ao qual essa escala pertence

  @ApiProperty({ description: 'id do user' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  userId: string; // ID do usuário responsável por essa escala

  @ApiProperty({ description: 'Data' })
  @IsDateString()
  date: string; // Data da escala (formato ISO: YYYY-MM-DD)

  @ApiProperty({ description: 'Descrição' })
  @IsString()
  @IsOptional()
  @Length(0, 1000)
  description: string; // Descrição do que o usuário tem que fazer naquele dia

  @ApiProperty({ description: 'Time' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'O horário deve estar no formato HH:mm (ex: 19:30)',
  })
  time: string;

  @ApiProperty({ description: 'Disponibilidade' })
  @IsBoolean()
  available: boolean; // Se o usuário tem disponibilidade

  @ApiProperty({ description: 'Confirmado' })
  @IsOptional()
  @IsBoolean()
  confirmed?: boolean; // Status indicando se a escala já foi confirmada pelos responsáveis
}
