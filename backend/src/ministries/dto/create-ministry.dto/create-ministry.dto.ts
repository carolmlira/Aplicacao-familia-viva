import {
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  export class CreateMinistriesDto {
    @ApiProperty({description: "nome Ministerio"})
    @IsString()
    @IsNotEmpty()
    @Length(3, 100)
    name: string; // Nome do ministério
  
    @ApiProperty({description: "Descrição minsterio"})
    @IsOptional()
    @IsString()
    @Length(0, 1000) 
    description?: string; // Descrição dos ministérios
  
    @ApiProperty({description: "Ativo ou n"})
    @IsBoolean()
    active: boolean; //Indica se o ministério está ativo/publicado.
  }
  