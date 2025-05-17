import { IsNotEmpty, IsString } from 'class-validator';
export class CreateFooter {
  @IsString()
  @IsNotEmpty()
  contato: string;

  @IsString()
  @IsNotEmpty()
  localizacao: string;

  @IsString()
  @IsNotEmpty()
  telefone: string;
}
