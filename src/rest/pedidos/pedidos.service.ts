import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { CreatePedidoDto } from './dto/create-pedido.dto'
import { UpdatePedidoDto } from './dto/update-pedido.dto'
import { Pedido } from './entities/pedido.entity'
import { MongoRepository, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { PedidosMapper } from './mappers/pedidos.mapper'
import { Funko } from '../funkos/entities/funko.entity'
import { ObjectId } from 'mongodb'

@Injectable()
export class PedidosService {
  private logger = new Logger(PedidosService.name)

  constructor(
    @InjectRepository(Pedido, 'mongo')
    private readonly pedidoRepositorio: MongoRepository<Pedido>,
    @InjectRepository(Funko)
    private readonly funkoRepositorio: Repository<Funko>,
    private readonly pedidosMapper: PedidosMapper,
  ) {}
  async findAll(take: number, skip: number) {
    this.logger.log(
      `Buscando todos los pedidos paginados y ordenados ${take} ${skip}`,
    )

    const [pedidos, total] = await this.pedidoRepositorio.findAndCount({
      take,
      skip,
      order: { createdAt: 'DESC' },
    })

    const totalPages = Math.ceil(total / take)

    return {
      pedidos,
      pagination: {
        totalDocs: total,
        limit: take,
        totalPages,
        page: Math.floor(skip / take) + 1,
        pagingCounter: skip + 1,
        hasPrevPage: skip > 0,
        hasNextPage: skip + take < total,
        prevPage: skip > 0 ? Math.floor((skip - take) / take) + 1 : null,
        nextPage:
          skip + take < total ? Math.floor((skip + take) / take) + 1 : null,
      },
    }
  }

  async findOne(id: ObjectId) {
    this.logger.log(`Buscando pedido con id ${id}`)
    const pedido = await this.pedidoRepositorio.find({ where: { _id: id } })
    //id to hex-string
    //id = id.toHexString()
    //const pedido = await this.pedidoRepositorio.findOne(id.toHexString())
    if (!pedido) {
      this.logger.log(`Pedido con id ${id} no encontrado`)
      throw new NotFoundException(`Pedido con id ${id} no encontrado`)
    }
    this.logger.log(pedido)
    return pedido
  }

  // async findPedidosByUserId(userId: number) {
  //   this.logger.log(`Buscando pedidos con userId ${userId}`)
  //   const pedidos = await this.pedidoRepositorio.find({
  //     where: { idUsuario: userId },
  //   })
  //   if (!pedidos) {
  //     this.logger.log(`Pedidos con userId ${userId} no encontrados`)
  //     throw new NotFoundException(`Pedidos con userId ${userId} no encontrados`)
  //   }
  //   this.logger.log(pedidos)
  //   return pedidos
  // }

  async create(createPedidoDto: CreatePedidoDto) {
    this.logger.log('Creando pedido')
    const pedido = this.pedidosMapper.toPedido(createPedidoDto)
    await this.comprobarPedido(pedido)

    const pedidoReservado = await this.actualizarStock(pedido)
    pedidoReservado.createdAt = new Date()
    pedidoReservado.updatedAt = new Date()
    return await this.pedidoRepositorio.save(pedidoReservado)
  }

  async update(id: ObjectId, updatePedidoDto: UpdatePedidoDto) {
    this.logger.log(`Actualizando pedido con id ${id}`)
    const pedido = await this.pedidoRepositorio.find({ where: { _id: id } })

    if (!pedido) {
      this.logger.log(`Pedido con id ${id} no encontrado`)
      throw new NotFoundException(`Pedido con id ${id} no encontrado`)
    }

    this.logger.log(`Actualizando pedido ${JSON.stringify(updatePedidoDto)}`)

    const pedidoActualizado =
      this.pedidosMapper.toPedidoFromUpdate(updatePedidoDto)

    this.logger.log(pedidoActualizado.lineasPedido)
    await this.actualizarStockCancelacion(pedidoActualizado)
    await this.comprobarPedido(pedidoActualizado)
    const pedidoNuevo = await this.actualizarStock(pedidoActualizado)
    pedidoNuevo.updatedAt = new Date()
    this.logger.log('todo correcto')
    return await this.pedidoRepositorio.save(pedidoNuevo)
  }

  async remove(id: ObjectId) {
    this.logger.log(`Eliminando pedido con id ${id}`)
    const pedido = await this.pedidoRepositorio.find({ where: { _id: id } })
    if (!pedido) {
      this.logger.log(`Pedido con id ${id} no encontrado`)
      throw new NotFoundException(`Pedido con id ${id} no encontrado`)
    }
    this.logger.log(`Pedido ${JSON.stringify(pedido)}`)

    const pedidoCancelado = pedido[0]
    if (!pedidoCancelado) {
      throw new BadRequestException('Pedido no encontrado')
    }

    this.logger.log(`Pedido ${JSON.stringify(pedidoCancelado)}`)

    await this.actualizarStockCancelacion(pedidoCancelado)
    return this.pedidoRepositorio.remove(pedidoCancelado)
  }
  private async comprobarPedido(pedido: Pedido): Promise<void> {
    this.logger.log(`Comprobando pedido ${JSON.stringify(pedido)}`)
    if (!pedido.lineasPedido || pedido.lineasPedido.length === 0) {
      throw new BadRequestException('El pedido no tiene lineas de pedido')
    }
    for (const linea of pedido.lineasPedido) {
      this.logger.log(`Comprobando linea ${JSON.stringify(linea)}`)
      this.logger.log(`Comprobando funko ${JSON.stringify(linea.idFunko)}`)
      const funko = await this.funkoRepositorio.findOneBy({
        id: linea.idFunko,
      })
      this.logger.log(`Funko ${JSON.stringify(funko)}`)
      if (!funko) {
        throw new BadRequestException(
          `El funko con id ${linea.idFunko} no existe`,
        )
      }
      if (funko.cantidad < linea.cantidad && linea.cantidad > 0) {
        throw new BadRequestException(
          `El funko con id ${linea.idFunko} no tiene stock suficiente`,
        )
      }
      if (funko.precio !== linea.precioFunko) {
        this.logger.log(
          `${funko.precio === linea.precioFunko}  y ${linea.precioFunko}`,
        )
        throw new BadRequestException(
          `El funko con id ${linea.idFunko} ha cambiado de precio`,
        )
      }
    }
  }

  private async actualizarStock(pedido: Pedido) {
    this.logger.log(`Actualizando stock del pedido ${JSON.stringify(pedido)}`)
    if (!pedido.lineasPedido || pedido.lineasPedido.length === 0) {
      throw new BadRequestException('El pedido no tiene lineas de pedido')
    }
    for (const linea of pedido.lineasPedido) {
      const funko = await this.funkoRepositorio.findOneBy({
        id: linea.idFunko,
      })
      funko.cantidad = funko.cantidad - linea.cantidad
      await this.funkoRepositorio.save(funko)
      linea.total = linea.cantidad * linea.precioFunko
    }
    pedido.totalPedido = pedido.lineasPedido.reduce(
      (sum, linea) => sum + linea.cantidad * linea.precioFunko,
      0,
    )
    pedido.totalItems = pedido.lineasPedido.reduce(
      (sum, linea) => sum + linea.cantidad,
      0,
    )
    return pedido
  }
  private async actualizarStockCancelacion(pedido: Pedido) {
    this.logger.log(`Actualizando stock de cancelación del pedido ${pedido}`)
    if (pedido.lineasPedido) {
      for (const linea of pedido.lineasPedido) {
        const funko = await this.funkoRepositorio.findOneBy({
          id: linea.idFunko,
        })
        funko.cantidad = funko.cantidad + linea.cantidad
        await this.funkoRepositorio.save(funko)
      }
    }
    return pedido
  }
}
