import {
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
  } from 'class-validator';
<<<<<<< HEAD
<<<<<<< HEAD
  import { ApiProperty } from '@nestjs/swagger';
  export class CreateMinistriesDto {
    @ApiProperty({description: "nome Ministerio"})
=======
  
  export class CreateMinistriesDto {
>>>>>>> 626a55d (Login e Auth do Front. Correção Usuarios e Auth do back)
=======
  import { ApiProperty } from '@nestjs/swagger';
  export class CreateMinistriesDto {
    @ApiProperty({description: "nome Ministerio"})
>>>>>>> 5a69e9e (Auth front, back e banco. Tabela de usuario(ADD,EDIT,Delet))
    @IsString()
    @IsNotEmpty()
    @Length(3, 100)
    name: string; // Nome do ministério
  
    @ApiProperty({description: "Descrição minsterio"})
    @IsOptional()
    @IsString()
    @Length(0, 1000) 
    description?: string; // Descrição dos ministérios
  
<<<<<<< HEAD
<<<<<<< HEAD
    @ApiProperty({description: "Ativo ou n"})
=======
>>>>>>> 626a55d (Login e Auth do Front. Correção Usuarios e Auth do back)
=======
    @ApiProperty({description: "Ativo ou n"})
>>>>>>> 5a69e9e (Auth front, back e banco. Tabela de usuario(ADD,EDIT,Delet))
    @IsBoolean()
    active: boolean; //Indica se o ministério está ativo/publicado.
  }
  