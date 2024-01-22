import { PartialType } from '@nestjs/mapped-types'
import {
  ClienteDto,
  CreatePedidoDto,
  LineaPedidoDto,
} from './create-pedido.dto'
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator'

export class UpdatePedidoDto extends PartialType(CreatePedidoDto) {
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  total?: number
  @IsNotEmpty()
  cliente?: ClienteDto
  @IsNotEmpty()
  lineasPedido?: LineaPedidoDto[]
}
