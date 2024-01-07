import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { CreateCategoriaDto } from './dto/create-categoria.dto'
import { UpdateCategoriaDto } from './dto/update-categoria.dto'
import { Categoria } from './entities/categoria.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CategoriasMapper } from './mappers/categorias-mapper/categorias-mapper'

@Injectable()
export class CategoriasService {
  private readonly logger = new Logger(CategoriasService.name)

  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    private readonly categoriasMapper: CategoriasMapper,
  ) {}
  async findAll() {
    this.logger.log('Buscando todas las categorias')
    return await this.categoriaRepository.find()
  }

  async findOne(id: string) {
    this.logger.log(`Buscando categoria con id: ${id}`)
    const categoiria = await this.categoriaRepository.findOneBy({ id })
    if (!categoiria) {
      this.logger.warn(`No se encontro categoria con id: ${id}`)
      throw new NotFoundException(`No se encontro categoria con id: ${id}`)
    }
    return categoiria
  }

  async create(createCategoriaDto: CreateCategoriaDto) {
    this.logger.log(`Creando nueva categoria: ${createCategoriaDto}`)
    return await this.categoriaRepository.save(
      this.categoriasMapper.toEntity(createCategoriaDto),
    )
  }

  async update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
    this.logger.log(
      `Actualizando categoria con id: ${id} con: ${updateCategoriaDto}`,
    )
    const categoria = await this.findOne(id)
    const categoriaActualizada = { ...categoria, ...updateCategoriaDto }

    return await this.categoriaRepository.save(categoriaActualizada)
  }

  async remove(id: string) {
    this.logger.log(`Eliminando categoria con id: ${id}`)
    const categoria = await this.findOne(id)
    return this.categoriaRepository.remove(categoria)
  }
}
