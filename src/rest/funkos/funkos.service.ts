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

@Injectable()
export class FunkosService {
  private readonly logger = new Logger(FunkosService.name)

  constructor(
    private readonly funkoMapper: FunkoMapper,
    @InjectRepository(Funko)
    private readonly funkoRepository: Repository<Funko>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
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
    }
    const funkoActualizado = await this.funkoRepository.save({
      ...funkoActualizar,
      ...updateFunkoDto,
      categoria: categoria ? categoria : (await funkoActualizar).categoria,
    })
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
