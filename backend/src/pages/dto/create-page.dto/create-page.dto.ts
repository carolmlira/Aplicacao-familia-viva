import {
  IsString,
  IsOptional,
  IsUrl,
  Length,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  Matches
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePageDto {
  @IsString()
  @Length(3, 150)
  title: string; // Título da página institucional. Obrigatório, mínimo de 3 e máximo de 150 caracteres.

  @IsString()
  @Length(10, 10000)
  content: string; // Conteúdo principal em HTML. Obrigatório, mínimo de 10 e máximo de 10000 caracteres.

  @IsOptional()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug deve conter apenas letras minúsculas, números e hífens',
  })
  slug?: string; // Ele vai funcionar como o link dentro da página e direcionar o usuário até a seção
  

  @IsOptional()
  @IsString()
  icon?: string; // Pode armazenar um nome de ícone (ex: "home", "info", "team"), útil pra exibir um ícone no frontend.

  @IsBoolean()
  active: boolean; //Indica se a página está ativa/publicada.

  @IsOptional()
  @IsUrl()
  imageUrl?: string; // URL da imagem de capa associada à página.

  @IsOptional()
  @IsString()
  updatedBy?: string; // Nome ou ID do usuário que editou a página por último.

  @IsOptional()
  @IsDate()
  @Type(() => Date) 
  createdAt?: Date; // Data de criação (geralmente definida automaticamente).

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  updatedAt?: Date; // Data da última atualização.


}
