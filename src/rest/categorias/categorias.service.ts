import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { CreateCategoriaDto } from './dto/create-categoria.dto'
import { UpdateCategoriaDto } from './dto/update-categoria.dto'
import { Categoria } from './entities/categoria.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class CategoriasService {
  private readonly logger = new Logger(CategoriasService.name)

  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
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

  create(createCategoriaDto: CreateCategoriaDto) {
    return 'This action adds a new categoria'
  }

  update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
    return `This action updates a #${id} categoria`
  }

  remove(id: string) {
    return `This action removes a #${id} categoria`
  }
}
