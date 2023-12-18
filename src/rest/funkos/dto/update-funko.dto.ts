import { PartialType } from '@nestjs/mapped-types';
import { CreateFunkoDto } from './create-funko.dto';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateFunkoDto extends PartialType(CreateFunkoDto) {
  @IsString()
  @IsOptional()
  nombre: string;
  @IsNumber()
  @IsOptional()
  @Min(0)
  precio: number;
  @IsNumber()
  @IsOptional()
  @Min(0)
  cantidad: number;
  @IsString()
  @IsOptional()
  imagen: string;
  @IsString()
  @IsOptional()
  categoria: string;
  @IsOptional()
  @IsBoolean()
  isDeleted: boolean;
}
