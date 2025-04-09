import {
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';
export class CreateMinistriesDto {

    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsOptional()
    @IsString()
    description?: string;

    @IsBoolean()
    active: boolean;
  }
  
