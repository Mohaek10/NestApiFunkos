import { IsNotEmpty, IsNumber, IsString, MaxLength, Min } from 'class-validator'

export class DireccionDto {
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  calle: string
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  numero: string
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  ciudad: string
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  provincia: string
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  pais: string
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  codigoPostal: string
}
export class ClienteDto {
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  nombre: string
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  apellido: string
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  telefono: string
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  email: string
  @IsNotEmpty()
  direccion: DireccionDto
}
export class LineaPedidoDto {
  @IsNotEmpty()
  @IsNumber()
  idFunko: number
  @IsNotEmpty()
  @Min(0, { message: 'El precio no puede ser negativo' })
  precioFunko: number
  @IsNotEmpty()
  @Min(1, { message: 'La cantidad debe ser mayor que 0' })
  cantidad: number
  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'El total no puede ser negativo' })
  total: number
}
export class CreatePedidoDto {
  @IsNotEmpty()
  @IsNumber()
  idUsuario: number
  @IsNotEmpty()
  cliente: ClienteDto
  @IsNotEmpty()
  lineasPedido: LineaPedidoDto[]
}
