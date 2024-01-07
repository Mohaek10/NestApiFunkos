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
  @Length(2, 50, { message: 'El nombre debe tener entre 2 y 50 caracteres' })
  nombre?: string

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean
}
