import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator'
import { Transform } from 'class-transformer'

export class CreateFunkoDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50, { message: 'El nombre debe tener entre 3 y 50 caracteres' })
  @Transform(({ value }) => value.trim())
  nombre: string

  @IsNumber()
  @Min(0, { message: 'El precio debe ser mayor a 0' })
  precio: number

  @IsNumber()
  @Min(0, { message: 'La cantidad debe ser mayor a 0' })
  cantidad: number

  @IsString()
  @IsOptional()
  imagen: string

  @IsString()
  @IsNotEmpty()
  categoria: string
}
