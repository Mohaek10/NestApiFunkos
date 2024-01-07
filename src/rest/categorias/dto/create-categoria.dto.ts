import { IsNotEmpty, IsString, Length } from 'class-validator'

export class CreateCategoriaDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  nombre: string
}
