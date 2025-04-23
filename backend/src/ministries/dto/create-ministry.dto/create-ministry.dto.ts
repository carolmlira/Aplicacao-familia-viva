import {
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
  } from 'class-validator';
  
  export class CreateMinistriesDto {
    @IsString()
    @IsNotEmpty()
    @Length(3, 100)
    name: string; // Nome do ministério
  
    @IsOptional()
    @IsString()
    @Length(0, 1000) 
    description?: string; // Descrição dos ministérios
  
    @IsBoolean()
    active: boolean; //Indica se o ministério está ativo/publicado.
  }
  