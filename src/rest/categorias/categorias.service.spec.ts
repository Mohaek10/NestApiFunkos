import { Test, TestingModule } from '@nestjs/testing'
import { CategoriasService } from './categorias.service'
import { Repository } from 'typeorm'
import { Categoria } from './entities/categoria.entity'
import { CategoriasMapper } from './mappers/categorias-mapper/categorias-mapper'
import { getRepositoryToken } from '@nestjs/typeorm'
import { NotFoundException } from '@nestjs/common'
import { Paginated } from 'nestjs-paginate'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { CreateCategoriaDto } from './dto/create-categoria.dto'

describe('CategoriasService', () => {
  let service: CategoriasService
  let repository: Repository<Categoria>
  let mapper: CategoriasMapper
  let cacheManager: Cache

  const categoriasMapperMock = {
    toEntity: jest.fn(),
  }

  const cacheManagerMock = {
    get: jest.fn(() => Promise.resolve()),
    set: jest.fn(() => Promise.resolve()),
    store: {
      keys: jest.fn(),
    },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriasService,
        { provide: CategoriasMapper, useValue: categoriasMapperMock },
        {
          provide: getRepositoryToken(Categoria),
          useClass: Repository,
        },
        { provide: CACHE_MANAGER, useValue: cacheManagerMock },
      ],
    }).compile()

    service = module.get<CategoriasService>(CategoriasService)
    repository = module.get<Repository<Categoria>>(
      getRepositoryToken(Categoria),
    )
    mapper = module.get<CategoriasMapper>(CategoriasMapper)
    cacheManager = module.get<Cache>(CACHE_MANAGER)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll', () => {
    it('Devuelve todas las categorías', async () => {
      const paginateOptions = {
        page: 1,
        limit: 10,
        path: 'categorias',
      }
      const testCategories = {
        data: [],
        meta: {
          itemsPerPage: 10,
          totalItems: 1,
          currentPage: 1,
          totalPages: 1,
        },
        links: {
          current: 'categorias?page=1&limit=10&sortBy=nombre:ASC',
        },
      } as Paginated<Categoria>
      jest
        .spyOn(cacheManager, 'get')
        .mockResolvedValueOnce(Promise.resolve(null))
      jest.spyOn(cacheManager, 'set').mockResolvedValueOnce()

      const mockQuery = {
        take: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([testCategories, 1]),
      }
      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValueOnce(mockQuery as any)

      const result: any = await service.findAll(paginateOptions)
      expect(result.meta.itemsPerPage).toEqual(paginateOptions.limit)
      expect(result.meta.currentPage).toEqual(paginateOptions.page)

      expect(cacheManager.get).toHaveBeenCalled()
      expect(cacheManager.set).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('Devuelve una categoría', async () => {
      const categoriaPrueba = new Categoria()
      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(categoriaPrueba)
      expect(await service.findOne('1')).toEqual(categoriaPrueba)
    })
    it('Devuelve error si no existe la categoría', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(undefined)
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException)
    })
  })
  describe('create', () => {
    it('Crea una categoría', async () => {
      const categoriaPrueba = new Categoria()
      categoriaPrueba.nombre = 'prueba'

      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      }
      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValueOnce(queryBuilder as any)
      jest.spyOn(mapper, 'toEntity').mockReturnValueOnce(categoriaPrueba)
      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(categoriaPrueba)
      jest.spyOn(repository, 'save').mockResolvedValueOnce(categoriaPrueba)
      jest.spyOn(service, 'comprobarNombreCategoria').mockResolvedValue(null)

      expect(await service.create(new CreateCategoriaDto())).toEqual(
        categoriaPrueba,
      )
      expect(mapper.toEntity).toHaveBeenCalled()
    })
  })
  describe('update', () => {
    it('Actualiza una categoría', async () => {
      const categoriaPrueba = new Categoria()
      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(categoriaPrueba)
      jest.spyOn(repository, 'save').mockResolvedValueOnce(categoriaPrueba)

      expect(await service.update('1', categoriaPrueba)).toEqual(
        categoriaPrueba,
      )
    })
    it('Devuelve error si no existe la categoría', async () => {
      const categoriaPrueba = new Categoria()
      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(undefined)
      await expect(service.update('1', categoriaPrueba)).rejects.toThrow(
        NotFoundException,
      )
    })
  })
  describe('remove', () => {
    it('Elimina una categoría', async () => {
      const categoriaPrueba = new Categoria()
      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(categoriaPrueba)
      jest.spyOn(repository, 'remove').mockResolvedValueOnce(categoriaPrueba)

      expect(await service.remove('1')).toEqual(categoriaPrueba)
    })
    it('Devuelve error si no existe la categoría', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(undefined)
      await expect(service.remove('1')).rejects.toThrow(NotFoundException)
    })
  })
  describe('borradoLogico', () => {
    it('Elimina una categoría', async () => {
      const categoriaPrueba = new Categoria()
      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(categoriaPrueba)
      jest.spyOn(repository, 'save').mockResolvedValueOnce(categoriaPrueba)

      expect(await service.removeLogical('1')).toEqual(categoriaPrueba)
    })
    it('Devuelve error si no existe la categoría', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(undefined)
      await expect(service.removeLogical('1')).rejects.toThrow(
        NotFoundException,
      )
    })
  })
})
