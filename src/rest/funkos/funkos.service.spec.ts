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

describe('FunkosService', () => {
  let service: FunkosService
  let funkoRep: Repository<Funko>
  let categoriaRep: Repository<Categoria>
  let funkoMapper: FunkoMapper

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FunkosService,
        { provide: getRepositoryToken(Funko), useClass: Repository },
        { provide: getRepositoryToken(Categoria), useClass: Repository },
        FunkoMapper,
      ],
    }).compile()

    service = module.get<FunkosService>(FunkosService)
    funkoRep = module.get<Repository<Funko>>(getRepositoryToken(Funko))
    categoriaRep = module.get<Repository<Categoria>>(
      getRepositoryToken(Categoria),
    )
    funkoMapper = module.get<FunkoMapper>(FunkoMapper)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll', () => {
    it('Devuelve todos los funkos', async () => {
      const resultado: ResponseFunkoDto[] = []
      const mockQuery = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockReturnValue(resultado),
      }
      jest
        .spyOn(funkoRep, 'createQueryBuilder')
        .mockReturnValue(mockQuery as any)
      jest
        .spyOn(funkoMapper, 'toResponse')
        .mockReturnValue({} as ResponseFunkoDto)

      expect(await service.findAll()).toEqual(resultado)
    })
  })
  describe('findOne', () => {
    it('Devuelve un funko', async () => {
      const resultado: ResponseFunkoDto = {} as ResponseFunkoDto
      const mockQuery = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockReturnValue(resultado),
      }
      jest
        .spyOn(funkoRep, 'createQueryBuilder')
        .mockReturnValue(mockQuery as any)
      jest
        .spyOn(funkoMapper, 'toResponse')
        .mockReturnValue({} as ResponseFunkoDto)

      expect(await service.findOne(1)).toEqual(resultado)
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

      expect(await service.create(createFunkoDto)).toEqual(mockResponseFunkoDto)
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
