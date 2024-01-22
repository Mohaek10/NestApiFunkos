import { Module } from '@nestjs/common'
import { PedidosService } from './pedidos.service'
import { PedidosController } from './pedidos.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Pedido } from './entities/pedido.entity'
import { PedidosMapper } from './mappers/pedidos.mapper'
import { Funko } from '../funkos/entities/funko.entity'

@Module({
  controllers: [PedidosController],
  providers: [PedidosService, PedidosMapper],
  imports: [
    TypeOrmModule.forFeature([Pedido], 'mongo'),
    TypeOrmModule.forFeature([Funko]),
  ],
  exports: [PedidosService],
})
export class PedidosModule {}
