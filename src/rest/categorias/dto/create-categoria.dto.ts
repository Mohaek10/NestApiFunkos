import { IsNotEmpty, IsString, Length } from 'class-validator'

export class CreateCategoriaDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50, { message: 'El nombre debe tener entre 2 y 50 caracteres' })
  nombre: string
}
