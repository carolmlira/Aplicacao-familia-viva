// dto/create-schedule.dto.ts
import { IsArray, IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateScheduleDto {
  @IsString()
  @IsNotEmpty()
  ministryId: string;

  @IsDateString()
  date: string;

  @IsArray()
  @IsString({ each: true })
  members: string[];

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  confirmed?: boolean;
}
