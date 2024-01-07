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
  HttpCode,
} from '@nestjs/common'
import { CategoriasService } from './categorias.service'
import { CreateCategoriaDto } from './dto/create-categoria.dto'
import { UpdateCategoriaDto } from './dto/update-categoria.dto'

@Controller('categorias')
export class CategoriasController {
  private readonly logger = new Logger(CategoriasController.name)
  constructor(private readonly categoriasService: CategoriasService) {}

  @Get()
  async findAll() {
    this.logger.log('Buscando todas las categorias')
    return await this.categoriasService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.log(`Buscando categoria con id: ${id}`)
    return await this.categoriasService.findOne(id)
  }

  @Post()
  @HttpCode(201)
  async create(@Body() createCategoriaDto: CreateCategoriaDto) {
    this.logger.log(`Creando nueva categoria: ${createCategoriaDto}`)
    return await this.categoriasService.create(createCategoriaDto)
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoriaDto: UpdateCategoriaDto,
  ) {
    this.logger.log(
      `Actualizando categoria con id: ${id} con: ${updateCategoriaDto}`,
    )
    return await this.categoriasService.update(id, updateCategoriaDto)
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.log(`Eliminando categoria con id: ${id}`)
    return await this.categoriasService.removeLogical(id)
  }
}
