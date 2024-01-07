import { PartialType } from '@nestjs/mapped-types'
import { CreateCategoriaDto } from './create-categoria.dto'
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator'

export class UpdateCategoriaDto extends PartialType(CreateCategoriaDto) {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  nombre?: string

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean
}
