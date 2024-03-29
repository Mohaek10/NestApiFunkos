import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { CreateCategoriaDto } from './dto/create-categoria.dto'
import { UpdateCategoriaDto } from './dto/update-categoria.dto'
import { Categoria } from './entities/categoria.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CategoriasMapper } from './mappers/categorias-mapper/categorias-mapper'
import { v4 as uuidv4 } from 'uuid'
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  PaginateQuery,
} from 'nestjs-paginate'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'

@Injectable()
export class CategoriasService {
  private readonly logger = new Logger(CategoriasService.name)

  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    private readonly categoriasMapper: CategoriasMapper,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async findAll(query: PaginateQuery) {
    this.logger.log('Buscando todas las categorias')
    const cache = await this.cacheManager.get(`categorias_${query.search}`)
    if (cache) {
      this.logger.log('Encontrado en cache')
      return cache
    }
    const result = await paginate(query, this.categoriaRepository, {
      sortableColumns: ['nombre'],
      defaultSortBy: [['nombre', 'ASC']],
      searchableColumns: ['nombre'],
      filterableColumns: {
        nombre: [FilterOperator.EQ, FilterSuffix.NOT],
        isDeleted: [FilterOperator.EQ, FilterSuffix.NOT],
      },
      //select: ['id', 'nombre', 'isDeleted', 'createdAt', 'updatedAt'],
    })
    await this.cacheManager.set(`categorias_${query.search}`, result, 3000)
    return result
  }

  async findOne(id: string): Promise<Categoria> {
    this.logger.log(`Buscando categoria con id: ${id}`)
    const categoiria = await this.categoriaRepository.findOneBy({ id })
    if (!categoiria) {
      this.logger.warn(`No se encontro categoria con id: ${id}`)
      throw new NotFoundException(`No se encontro categoria con id: ${id}`)
    }
    return categoiria
  }

  async create(createCategoriaDto: CreateCategoriaDto): Promise<Categoria> {
    this.logger.log(`Creando nueva categoria: ${createCategoriaDto.nombre}`)
    //comprobar que el nombre de la categoria no este creada ya

    const categoriaToCreate = this.categoriasMapper.toEntity(createCategoriaDto)
    if (categoriaToCreate.nombre) {
      await this.comprobarNombreCategoria(categoriaToCreate.nombre)
    }

    return await this.categoriaRepository.save({
      ...categoriaToCreate,
      id: uuidv4(),
    })
  }

  async update(
    id: string,
    updateCategoriaDto: UpdateCategoriaDto,
  ): Promise<Categoria> {
    this.logger.log(
      `Actualizando categoria con id: ${id} con: ${updateCategoriaDto}`,
    )
    const categoriaToUpdate = await this.findOne(id)
    if (updateCategoriaDto.nombre) {
      await this.comprobarNombreCategoria(updateCategoriaDto.nombre)
    }
    return await this.categoriaRepository.save({
      ...categoriaToUpdate,
      ...updateCategoriaDto,
    })
  }

  async remove(id: string): Promise<Categoria> {
    this.logger.log(`Eliminando categoria con id: ${id}`)
    const categoria = await this.findOne(id)
    return this.categoriaRepository.remove(categoria)
  }
  async removeLogical(id: string): Promise<Categoria> {
    this.logger.log(`Eliminando logicamente categoria con id: ${id}`)
    const categoria = await this.findOne(id)
    return this.categoriaRepository.save({
      ...categoria,
      updatedAt: new Date(),
      isDeleted: true,
    })
  }
  public async comprobarNombreCategoria(nombre: string): Promise<Categoria> {
    const categoria = await this.categoriaRepository
      .createQueryBuilder('categoria')
      .where('LOWER(nombre)=LOWER(:nombre)', {
        nombre: nombre.toLowerCase(),
      })
      .getOne()
    if (categoria) {
      this.logger.warn(`Categoria con nombre ${nombre} ya existente`)
      throw new BadRequestException(`Categoria ${nombre}  ya existente`)
    }
    return categoria
  }
}
