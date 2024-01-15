import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { CreateFunkoDto } from './dto/create-funko.dto'
import { UpdateFunkoDto } from './dto/update-funko.dto'
import { FunkoMapper } from './mappers/funko-mapper/funko-mapper'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Funko } from './entities/funko.entity'
import { Categoria } from '../categorias/entities/categoria.entity'
import { ResponseFunkoDto } from './dto/response-funko.dto'
import { StorageService } from '../storage/storage.service'
import { Request } from 'express'
import { FunkosNotificationsGateway } from '../websockets/notifications/funkos-notifications.gateway'
import {
  Notificacion,
  NotificacionTipo,
} from '../websockets/notifications/models/notificacion.model'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import {
  FilterOperator,
  FilterSuffix,
  paginate,
  PaginateQuery,
} from 'nestjs-paginate'
import { hash } from 'typeorm/util/StringUtils'

@Injectable()
export class FunkosService {
  private readonly logger = new Logger(FunkosService.name)

  constructor(
    private readonly funkoMapper: FunkoMapper,
    @InjectRepository(Funko)
    private readonly funkoRepository: Repository<Funko>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    private readonly storageService: StorageService,
    private readonly funkoNotificationsGateway: FunkosNotificationsGateway,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(query: PaginateQuery) {
    this.logger.log('Buscando todos los funko')
    const cache = await this.cacheManager.get(
      `funkos_${hash(JSON.stringify(query))}`,
    )
    if (cache) {
      this.logger.log('Datos obtenidos de la cache')
      return cache
    }
    const queryBuilder = this.funkoRepository
      .createQueryBuilder('funko')
      .leftJoinAndSelect('funko.categoria', 'categoria')

    const paginatedResult = await paginate(query, queryBuilder, {
      sortableColumns: ['nombre', 'precio', 'cantidad'],
      defaultSortBy: [['nombre', 'ASC']],
      searchableColumns: ['nombre', 'precio', 'cantidad'],
      filterableColumns: {
        nombre: [FilterOperator.EQ, FilterSuffix.NOT],
        precio: [FilterOperator.GT],
        cantidad: true,
        isDeleted: [FilterOperator.EQ, FilterSuffix.NOT],
      },
    })
    const resultado = {
      data: (paginatedResult.data ?? []).map((funko) =>
        this.funkoMapper.toResponse(funko),
      ),
      meta: paginatedResult.meta,
      links: paginatedResult.links,
    }
    await this.cacheManager.set(
      `funkos_${hash(JSON.stringify(query))}`,
      resultado,
      60,
    )
    return resultado
  }

  async findOne(id: number): Promise<ResponseFunkoDto> {
    this.logger.log('Buscando un funko')
    const cache: ResponseFunkoDto = await this.cacheManager.get(`funko-${id}`)
    if (cache) {
      this.logger.log('Datos obtenidos de la cache')
      return cache
    }
    const buscarFunko = await this.funkoRepository
      .createQueryBuilder('funko')
      .leftJoinAndSelect('funko.categoria', 'categoria')
      .where('funko.id = :id', { id: id })
      .getOne()

    if (!buscarFunko) {
      this.logger.warn(`Funko con id ${id} no encontrado`)
      throw new NotFoundException(`Funko con id ${id} no encontrado`)
    }
    const funkoDto = this.funkoMapper.toResponse(buscarFunko)
    await this.cacheManager.set(`funko-${id}`, funkoDto, 60)
    return funkoDto
  }
  async create(createFunkoDto: CreateFunkoDto): Promise<ResponseFunkoDto> {
    this.logger.log(`Creando un funko ${JSON.stringify(createFunkoDto)}`)

    const categoria = await this.comprobarCategoria(createFunkoDto.categoria)
    const funko = this.funkoMapper.toFunko(createFunkoDto, categoria)
    const funkoCreado = await this.funkoRepository.save(funko)
    const dto = this.funkoMapper.toResponse(funkoCreado)
    //Eliminar en cache
    await this.invalidateCacheKey('funkos')
    this.onChanges(NotificacionTipo.CREATE, dto)
    return dto
  }

  async update(
    id: number,
    updateFunkoDto: UpdateFunkoDto,
  ): Promise<ResponseFunkoDto> {
    this.logger.log('Actualizando un funko')
    const funkoActualizar = this.funkoExists(id)
    let categoria: Categoria
    if (updateFunkoDto.categoria) {
      categoria = await this.comprobarCategoria(updateFunkoDto.categoria)
    } else {
      categoria = (await funkoActualizar).categoria
    }
    const nuevoFunko = this.funkoMapper.toFunkoFromUpdate(
      await funkoActualizar,
      updateFunkoDto,
      categoria,
    )
    this.logger.log(`Actualizando un funko ${JSON.stringify(nuevoFunko)}`)

    const funkoActualizado = await this.funkoRepository.save(nuevoFunko)
    this.logger.log(`Funko actualizado ${JSON.stringify(funkoActualizado)}`)
    const dto = this.funkoMapper.toResponse(funkoActualizado)
    //Eliminar en cache
    await this.invalidateCacheKey('funkos')
    this.onChanges(NotificacionTipo.UPDATE, dto)
    return dto
  }

  async remove(id: number): Promise<Funko> {
    this.logger.log(`Eliminando un funko con id ${id}`)
    const funkoEliminar = await this.funkoExists(id)
    return await this.funkoRepository.remove(funkoEliminar)
  }

  async borradoLogico(id: number): Promise<Funko> {
    this.logger.log(`Eliminando un funko con id ${id}`)
    const funkoEliminar = await this.funkoExists(id)
    funkoEliminar.isDeleted = true
    const imagenAborrar = funkoEliminar.imagen
    if (imagenAborrar !== 'https://via.placeholder.com/150') {
      try {
        this.storageService.borraFichero(imagenAborrar)
      } catch (error) {
        this.logger.error(`Error al eliminar la imagen ${error}`)
      }
    }
    const funkoBorrado = await this.funkoRepository.save(funkoEliminar)
    const dto = this.funkoMapper.toResponse(funkoBorrado)
    this.onChanges(NotificacionTipo.DELETE, dto)
    //Eliminar cache
    await this.invalidateCacheKey('funkos')
    return funkoBorrado
  }

  public async actualizarImagen(
    id: number,
    file: Express.Multer.File,
    req: Request,
    withUrl: boolean,
  ) {
    this.logger.log(`Actualizando imagen del funko con id ${id}`)
    let funko: Funko
    try {
      funko = await this.funkoExists(id)
    } catch (error) {
      throw new BadRequestException(error.message)
    }
    if (funko.imagen !== 'https://via.placeholder.com/150') {
      this.logger.log(`Eliminando imagen del funko con id ${id}`)
      const fileNameWithOutUrl = funko.imagen
      try {
        this.storageService.borraFichero(fileNameWithOutUrl)
      } catch (error) {
        this.logger.error(`Error al eliminar la imagen ${error}`)
      }
    }
    if (!file) {
      throw new BadRequestException('No se ha subido ningún fichero')
    }
    let filePath: string

    if (withUrl) {
      this.logger.log('Generando url')
      const version = process.env.VERSION ? `/${process.env.VERSION}` : 'api'
      filePath = `${req.protocol}://${req.get('host')}${version}/storage/${
        file.filename
      }`
    } else {
      filePath = file.filename
    }
    funko.imagen = file.filename
    await this.funkoRepository.save(funko)
    funko.imagen = filePath
    const dto = this.funkoMapper.toResponse(funko)
    this.onChanges(NotificacionTipo.UPDATE, dto)
    //Eliminar cache
    await this.invalidateCacheKey('funkos')
    return dto
  }
  public async funkoExists(id: number): Promise<Funko> {
    const funko = await this.funkoRepository.findOneBy({ id })
    if (!funko) {
      this.logger.warn(`Funko con id ${id} no encontrado`)
      throw new NotFoundException(`Funko con id ${id} no encontrado`)
    }
    return funko
  }

  public async comprobarCategoria(nombreCategoria: string): Promise<Categoria> {
    const categoria = await this.categoriaRepository
      .createQueryBuilder('categoria')
      .where('LOWER(nombre)=LOWER(:nombre)', {
        nombre: nombreCategoria.toLowerCase(),
      })
      .getOne()
    if (!categoria) {
      this.logger.warn(`Categoria con nombre ${nombreCategoria} no encontrada`)
      throw new BadRequestException(
        `Categoria ${nombreCategoria} no encontrada`,
      )
    }
    return categoria
  }
  private onChanges(tipo: NotificacionTipo, data: ResponseFunkoDto) {
    const notificacion = new Notificacion<ResponseFunkoDto>(
      'Funkos',
      tipo,
      data,
      new Date(),
    )
    this.funkoNotificationsGateway.sendMessage(notificacion)
  }
  public async invalidateCacheKey(keyPattern: string): Promise<void> {
    const cacheKeys = await this.cacheManager.store.keys()
    const keysToDelete = cacheKeys.filter((key) => key.startsWith(keyPattern))
    const promises = keysToDelete.map((key) => this.cacheManager.del(key))
    await Promise.all(promises)
  }
}
