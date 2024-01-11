import {
  BadRequestException,
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
  ) {}

  async findAll(): Promise<ResponseFunkoDto[]> {
    this.logger.log('Buscando todos los funko')
    const funkos = await this.funkoRepository
      .createQueryBuilder('funko')
      .leftJoinAndSelect('funko.categoria', 'categoria')
      .orderBy('funko.id', 'DESC')
      .getMany()

    return funkos.map((funko) => this.funkoMapper.toResponse(funko))
  }

  async findOne(id: number): Promise<ResponseFunkoDto> {
    this.logger.log('Buscando un funko')
    const buscarFunko = await this.funkoRepository
      .createQueryBuilder('funko')
      .leftJoinAndSelect('funko.categoria', 'categoria')
      .where('funko.id = :id', { id: id })
      .getOne()

    if (!buscarFunko) {
      this.logger.warn(`Funko con id ${id} no encontrado`)
      throw new NotFoundException(`Funko con id ${id} no encontrado`)
    }
    return this.funkoMapper.toResponse(buscarFunko)
  }
  async create(createFunkoDto: CreateFunkoDto): Promise<ResponseFunkoDto> {
    this.logger.log(`Creando un funko ${JSON.stringify(createFunkoDto)}`)

    const categoria = await this.comprobarCategoria(createFunkoDto.categoria)
    const funko = this.funkoMapper.toFunko(createFunkoDto, categoria)
    const funkoCreado = await this.funkoRepository.save(funko)
    return this.funkoMapper.toResponse(funkoCreado)
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
    return this.funkoMapper.toResponse(funkoActualizado)
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
    return await this.funkoRepository.save(funkoEliminar)
  }

  public async actualizarImagen(
    id: number,
    file: Express.Multer.File,
    req: Request,
    withUrl: boolean,
  ) {
    this.logger.log(`Actualizando imagen del funko con id ${id}`)
    const funko = await this.funkoExists(id)
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
    return this.funkoMapper.toResponse(funko)
  }
  public async crearUrlImagen(id: number, req: Request) {
    this.logger.log(`Creando url imagen del funko con id ${id}`)
    const funko = await this.funkoExists(id)
    if (funko.imagen === 'https://via.placeholder.com/150') {
      return funko.imagen
    }
    const version = process.env.VERSION ? `/${process.env.VERSION}` : 'api'
    return `${req.protocol}://${req.get('host')}${version}/storage/${
      funko.imagen
    }`
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
}
