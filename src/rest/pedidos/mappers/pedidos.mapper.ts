import { Injectable } from '@nestjs/common'
import { CreatePedidoDto } from '../dto/create-pedido.dto'
import { plainToClass } from 'class-transformer'
import { Pedido } from '../entities/pedido.entity'
import { UpdatePedidoDto } from '../dto/update-pedido.dto'

@Injectable()
export class PedidosMapper {
  toPedido(createPedidoDto: CreatePedidoDto) {
    return plainToClass(Pedido, createPedidoDto)
  }
  toPedidoFromUpdate(updatePedidoDto: UpdatePedidoDto) {
    return plainToClass(Pedido, updatePedidoDto)
  }
}
