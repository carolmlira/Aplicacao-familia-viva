import {
    IsArray,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
  } from 'class-validator';
  
  export class CreateEventDto {
    @IsString()
    @IsNotEmpty()
    title: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  
    @IsArray()
    @IsString({ each: true })
    days: string[]; // Ex: ["Tuesday", "Sunday"]
  
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: 'O horário deve estar no formato HH:mm (ex: 19:30)',
    })
    time: string;
  }
  
