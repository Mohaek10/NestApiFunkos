import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  Query,
} from '@nestjs/common'
import { PedidosService } from './pedidos.service'
import { CreatePedidoDto } from './dto/create-pedido.dto'
import { UpdatePedidoDto } from './dto/update-pedido.dto'
import { ObjectIdValidatePipe } from './pipes/pipes.pipe'
import { ObjectId } from 'mongodb'

@Controller('pedidos')
export class PedidosController {
  private readonly logger = new Logger(PedidosController.name)
  constructor(private readonly pedidosService: PedidosService) {}

  @Get()
  async findAll(@Query() { take = '10', skip = '0' }) {
    return await this.pedidosService.findAll(
      parseInt(take, 10),
      parseInt(skip, 10),
    )
  }

  @Get(':id')
  async findOne(@Param('id', ObjectIdValidatePipe) id: ObjectId) {
    this.logger.log(`Buscando pedido con id ${id}`)
    return await this.pedidosService.findOne(id)
  }
  // @Get('usuario/:id')
  // async findByUser(@Param('id') id: number) {
  //   this.logger.log(`Buscando pedido con id ${id}`)
  //   return await this.pedidosService.findPedidosByUserId(id)
  // }

  @Post()
  create(@Body() createPedidoDto: CreatePedidoDto) {
    this.logger.log('Creando pedido, controller')
    return this.pedidosService.create(createPedidoDto)
  }

  @Patch(':id')
  update(
    @Param('id', ObjectIdValidatePipe) id: ObjectId,
    @Body() updatePedidoDto: UpdatePedidoDto,
  ) {
    return this.pedidosService.update(id, updatePedidoDto)
  }

  @Delete(':id')
  remove(@Param('id', ObjectIdValidatePipe) id: ObjectId) {
    return this.pedidosService.remove(id)
  }
}
