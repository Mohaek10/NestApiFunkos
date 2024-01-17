import { Test, TestingModule } from '@nestjs/testing'
import { FunkosService } from './funkos.service'
import { Repository } from 'typeorm'
import { Funko } from './entities/funko.entity'
import { Categoria } from '../categorias/entities/categoria.entity'
import { FunkoMapper } from './mappers/funko-mapper/funko-mapper'
import { getRepositoryToken } from '@nestjs/typeorm'
import { ResponseFunkoDto } from './dto/response-funko.dto'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { CreateFunkoDto } from './dto/create-funko.dto'
import { StorageService } from '../storage/storage.service'
import { FunkosNotificationsGateway } from '../websockets/notifications/funkos-notifications.gateway'
import { Cache } from 'cache-manager'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { NotificationsModule } from '../websockets/notifications/notifications.module'
import { Paginated } from 'nestjs-paginate'
import { hash } from 'typeorm/util/StringUtils'

describe('FunkosService', () => {
  let service: FunkosService
  let funkoRep: Repository<Funko>
  let categoriaRep: Repository<Categoria>
  let funkoMapper: FunkoMapper
  let storageService: StorageService
  let funkoNotificationsGateway: FunkosNotificationsGateway
  let cacheManager: Cache

  const funkoMapperMock = () => ({
    toFunko: jest.fn(),
    toResponse: jest.fn(),
    toFunkoFromUpdate: jest.fn(),
  })

  const storageServiceMock = () => ({
    borraFichero: jest.fn(),
    encontrarFichero: jest.fn(),
  })
  const funkoNotificationsGatewayMock = () => ({
    sendMessage: jest.fn(),
  })
  const cacheManagerMock = {
    get: jest.fn(() => Promise.resolve()),
    set: jest.fn(() => Promise.resolve()),
    store: {
      keys: jest.fn(),
    },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [NotificationsModule],
      providers: [
        FunkosService,
        { provide: getRepositoryToken(Funko), useClass: Repository },
        { provide: getRepositoryToken(Categoria), useClass: Repository },
        { provide: FunkoMapper, useFactory: funkoMapperMock },
        { provide: StorageService, useValue: storageServiceMock },
        {
          provide: FunkosNotificationsGateway,
          useFactory: funkoNotificationsGatewayMock,
        },
        { provide: CACHE_MANAGER, useValue: cacheManagerMock },
      ],
    }).compile()

    service = module.get<FunkosService>(FunkosService)
    funkoRep = module.get<Repository<Funko>>(getRepositoryToken(Funko))
    categoriaRep = module.get<Repository<Categoria>>(
      getRepositoryToken(Categoria),
    )
    funkoMapper = module.get<FunkoMapper>(FunkoMapper)
    storageService = module.get<StorageService>(StorageService)
    funkoNotificationsGateway = module.get<FunkosNotificationsGateway>(
      FunkosNotificationsGateway,
    )
    cacheManager = module.get<Cache>(CACHE_MANAGER)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll', () => {
    it('Devuelve todos los funkos', async () => {
      const paginateQuery = {
        page: 1,
        limit: 10,
        path: 'funkos',
      }
      const paginationSolution = {
        data: [],
        meta: {
          itemsPerPage: 10,
          totalItems: 1,
          currentPage: 1,
          totalPages: 1,
        },
        links: {
          first: 'funkos?page=1&limit=10',
          previous: '',
          next: '',
          last: 'funkos?page=1&limit=10',
        },
      } as Paginated<ResponseFunkoDto>
      jest.spyOn(cacheManager, 'get').mockResolvedValue(Promise.resolve(null))
      jest.spyOn(cacheManager, 'set').mockResolvedValue()

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([]),
      }
      jest
        .spyOn(funkoRep, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any)
      jest
        .spyOn(funkoMapper, 'toResponse')
        .mockReturnValue(new ResponseFunkoDto())

      const resultado: any = await service.findAll(paginateQuery)
      expect(resultado.meta.itemsPerPage).toEqual(paginateQuery.limit)
      expect(resultado.meta.currentPage).toEqual(paginateQuery.page)
      expect(cacheManager.get).toHaveBeenCalled()
      expect(cacheManager.set).toHaveBeenCalled()
    })
    it('Devuelve la cache', async () => {
      const paginateOptions = {
        page: 1,
        limit: 10,
        path: 'funkos',
      }
      const testFunkos = {
        data: [],
        meta: {
          itemsPerPage: 10,
          totalItems: 1,
          currentPage: 1,
          totalPages: 1,
        },
        links: {
          first: 'funkos?page=1&limit=10',
          previous: '',
          next: '',
          last: 'funkos?page=1&limit=10',
        },
      } as Paginated<Funko>
      jest.spyOn(cacheManager, 'get').mockResolvedValue(testFunkos)
      const result = await service.findAll(paginateOptions)
      expect(cacheManager.get).toHaveBeenCalledWith(
        `funkos_${hash(JSON.stringify(paginateOptions))}`,
      )
      expect(result).toEqual(testFunkos)
    })
  })
  describe('findOne', () => {
    it('Devuelve un funko', async () => {
      const resultado = new Funko()
      const dto = new ResponseFunkoDto()
      const mockQuery = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockReturnValue(resultado),
      }
      jest.spyOn(cacheManager, 'get').mockResolvedValue(Promise.resolve(null))
      jest
        .spyOn(funkoRep, 'createQueryBuilder')
        .mockReturnValue(mockQuery as any)
      jest.spyOn(funkoMapper, 'toResponse').mockReturnValue(dto)
      jest.spyOn(cacheManager, 'set').mockResolvedValue()

      expect(await service.findOne(1)).toEqual(dto)
      expect(funkoMapper.toResponse).toHaveBeenCalled()
    })
    it('Lanza NotFoundException si no encuentra el funko', async () => {
      const mockQuery = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockReturnValue(null),
      }
      jest
        .spyOn(funkoRep, 'createQueryBuilder')
        .mockReturnValue(mockQuery as any)

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException)
    })
  })

  describe('create', () => {
    it('Crea Un funko', async () => {
      const createFunkoDto = new CreateFunkoDto()
      const mockCategoria = new Categoria()
      const mockFunko = new Funko()
      const mockResponseFunkoDto = new ResponseFunkoDto()

      jest.spyOn(service, 'comprobarCategoria').mockResolvedValue(mockCategoria)
      jest.spyOn(funkoMapper, 'toFunko').mockReturnValue(mockFunko)
      jest.spyOn(funkoRep, 'save').mockResolvedValue(mockFunko)
      jest
        .spyOn(funkoMapper, 'toResponse')
        .mockReturnValue(mockResponseFunkoDto)
      jest.spyOn(cacheManager.store, 'keys').mockResolvedValue([])

      expect(await service.create(createFunkoDto)).toEqual(mockResponseFunkoDto)
      expect(cacheManager.store.keys).toHaveBeenCalled()
      expect(service.comprobarCategoria).toHaveBeenCalled()
    })
  })

  describe('update', () => {
    it('Actualiza un funko', async () => {
      const updateFunkoDto = new CreateFunkoDto()
      const mockFunko = new Funko()
      const mockResponseFunkoDto = new ResponseFunkoDto()

      jest.spyOn(service, 'funkoExists').mockResolvedValue(mockFunko)

      jest.spyOn(funkoRep, 'save').mockResolvedValue(mockFunko)
      jest
        .spyOn(funkoMapper, 'toResponse')
        .mockReturnValue(mockResponseFunkoDto)

      expect(await service.update(1, updateFunkoDto)).toEqual(
        mockResponseFunkoDto,
      )
    })
  })
  describe('remove', () => {
    it('Elimina un funko', async () => {
      const mockFunko = new Funko()
      jest.spyOn(service, 'funkoExists').mockResolvedValue(mockFunko)
      jest.spyOn(funkoRep, 'remove').mockResolvedValue(mockFunko)
      expect(await service.remove(1)).toEqual(mockFunko)
    })
  })

  describe('BorradoLogico', () => {
    it('Borra un funko', async () => {
      const mockFunko = new Funko()
      jest.spyOn(service, 'funkoExists').mockResolvedValue(mockFunko)
      jest.spyOn(funkoRep, 'save').mockResolvedValue(mockFunko)
      expect(await service.borradoLogico(1)).toEqual(mockFunko)
    })
  })
  describe('comprobarCategoria', () => {
    it('Devuelve true si existe la categoria', async () => {
      const mockCategoria = new Categoria()
      const nombreCategoria = 'nombreCategoria'
      const mockQuery = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockReturnValue(mockCategoria),
      }

      jest
        .spyOn(categoriaRep, 'createQueryBuilder')
        .mockReturnValue(mockQuery as any)
      expect(await service.comprobarCategoria(nombreCategoria)).toBe(
        mockCategoria,
      )
    })
    it('Devuelve Falso si no existe la categoria', async () => {
      const nombreCategoria = 'nombreCategoria'
      const mockQuery = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockReturnValue(null),
      }

      jest
        .spyOn(categoriaRep, 'createQueryBuilder')
        .mockReturnValue(mockQuery as any)
      await expect(service.comprobarCategoria(nombreCategoria)).rejects.toThrow(
        BadRequestException,
      )
    })
  })
})
