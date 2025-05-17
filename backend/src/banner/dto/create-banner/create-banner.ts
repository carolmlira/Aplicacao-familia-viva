import { IsString, IsOptional } from 'class-validator';

export class CreateBannerDto {
  @IsOptional()
  @IsString()
  imagemLogo?: string;

  @IsOptional()
  @IsString()
  imagemBanner?: string;

  @IsOptional()
  @IsString()
  frase?: string;
}
