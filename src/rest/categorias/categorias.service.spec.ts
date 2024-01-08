import { Test, TestingModule } from '@nestjs/testing'
import { CategoriasService } from './categorias.service'
import { Repository } from 'typeorm'
import { Categoria } from './entities/categoria.entity'
import { CategoriasMapper } from './mappers/categorias-mapper/categorias-mapper'
import { getRepositoryToken } from '@nestjs/typeorm'
import { NotFoundException } from '@nestjs/common'

describe('CategoriasService', () => {
  let service: CategoriasService
  let repository: Repository<Categoria>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriasService,
        CategoriasMapper,
        {
          provide: getRepositoryToken(Categoria),
          useClass: Repository,
        },
      ],
    }).compile()

    service = module.get<CategoriasService>(CategoriasService)
    repository = module.get<Repository<Categoria>>(
      getRepositoryToken(Categoria),
    )
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('findAll', () => {
    it('Devuelve todas las categorías', async () => {
      const categoriasPrueba = new Categoria()
      jest.spyOn(repository, 'find').mockResolvedValueOnce([categoriasPrueba])
      expect(await service.findAll()).toEqual([categoriasPrueba])
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
      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(categoriaPrueba)
      jest.spyOn(repository, 'save').mockResolvedValueOnce(categoriaPrueba)

      expect(await service.create(categoriaPrueba)).toEqual(categoriaPrueba)
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
