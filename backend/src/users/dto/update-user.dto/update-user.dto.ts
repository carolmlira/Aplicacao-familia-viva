import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../create-user.dto/create-user.dto';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ValidateIf((o) => o.password !== undefined)
  @IsNotEmpty({ message: 'Senha antiga é obrigatória para alterar a senha' })
  @IsString()
  oldSenha?: string;
}
