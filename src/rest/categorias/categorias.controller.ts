import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
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
  findOne(@Param('id') id: string) {
    this.logger.log(`Buscando categoria con id: ${id}`)
    return this.categoriasService.findOne(id)
  }

  @Post()
  create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriasService.create(createCategoriaDto)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoriaDto: UpdateCategoriaDto,
  ) {
    return this.categoriasService.update(id, updateCategoriaDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriasService.remove(id)
  }
}
