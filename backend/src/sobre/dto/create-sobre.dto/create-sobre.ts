import { IsString, IsOptional } from 'class-validator';

export class CreateSobre {
  @IsString()
  titulo: string;

  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  imagem?: string;
}
