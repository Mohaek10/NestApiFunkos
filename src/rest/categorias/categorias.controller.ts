import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Logger,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common'
import { CategoriasService } from './categorias.service'
import { CreateCategoriaDto } from './dto/create-categoria.dto'
import { UpdateCategoriaDto } from './dto/update-categoria.dto'

@Controller('categorias')
export class CategoriasController {
  private readonly logger = new Logger(CategoriasController.name)
  constructor(private readonly categoriasService: CategoriasService) {}

  @Get()
  findAll() {
    this.logger.log('Buscando todas las categorias')
    return this.categoriasService.findAll()
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.log(`Buscando categoria con id: ${id}`)
    return this.categoriasService.findOne(id)
  }

  @Post()
  create(@Body() createCategoriaDto: CreateCategoriaDto) {
    this.logger.log(`Creando nueva categoria: ${createCategoriaDto}`)
    return this.categoriasService.create(createCategoriaDto)
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoriaDto: UpdateCategoriaDto,
  ) {
    this.logger.log(
      `Actualizando categoria con id: ${id} con: ${updateCategoriaDto}`,
    )
    return this.categoriasService.update(id, updateCategoriaDto)
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.log(`Eliminando categoria con id: ${id}`)
    return await this.categoriasService.remove(id)
  }
}
