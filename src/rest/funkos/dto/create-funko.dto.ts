import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateFunkoDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  nombre: string;

  @IsNumber()
  @Min(0)
  precio: number;

  @IsNumber()
  @Min(0)
  cantidad: number;

  @IsString()
  @IsOptional()
  imagen: string;

  @IsString()
  @IsNotEmpty()
  categoria: string;
}
