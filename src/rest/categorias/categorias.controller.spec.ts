import { Test, TestingModule } from '@nestjs/testing'
import { CategoriasController } from './categorias.controller'
import { CategoriasService } from './categorias.service'
import { Categoria } from './entities/categoria.entity'
import { NotFoundException } from '@nestjs/common'

describe('CategoriasController', () => {
  let controller: CategoriasController
  let service: CategoriasService
  beforeEach(async () => {
    const mockCategoriesService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      removeLogical: jest.fn(),
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriasController],
      providers: [
        {
          provide: CategoriasService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile()

    controller = module.get<CategoriasController>(CategoriasController)
    service = module.get<CategoriasService>(CategoriasService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('findAll', () => {
    it('Debe de obtener todas las categorias', async () => {
      const mockResultado: Array<Categoria> = []
      jest.spyOn(service, 'findAll').mockResolvedValue(mockResultado)
      const result = await controller.findAll()
      expect(result).toBe(mockResultado)
      expect(service.findAll).toHaveBeenCalled()
    })
  })
  describe('findOne', () => {
    it('Debe de obtener una categoria', async () => {
      const mockResultado: Categoria = {
        id: '1',
        nombre: 'MARVEL',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
        funkos: [],
      }
      jest.spyOn(service, 'findOne').mockResolvedValue(mockResultado)
      const result = await controller.findOne('1')
      expect(result).toBe(mockResultado)
      expect(service.findOne).toHaveBeenCalled()
    })

    it('Debe de dar error al no encontrar una categoria', async () => {
      const id = 'noexiste'
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException())
      await expect(controller.findOne(id)).rejects.toThrow(NotFoundException)
    })
  })
  describe('create', () => {
    it('Debe de crear una categoria', async () => {
      const mockResultado: Categoria = {
        id: '1',
        nombre: 'ANIME',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
        funkos: [],
      }
      jest.spyOn(service, 'create').mockResolvedValue(mockResultado)
      const result = await controller.create({
        nombre: 'ANIME',
      })
      expect(result).toBe(mockResultado)
      expect(service.create).toHaveBeenCalled()
    })
  })
  describe('update', () => {
    it('Debe de actualizar una categoria', async () => {
      const mockResultado: Categoria = {
        id: '1',
        nombre: 'ANIME',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
        funkos: [],
      }
      jest.spyOn(service, 'update').mockResolvedValue(mockResultado)
      const result = await controller.update('1', {
        nombre: 'ANIME',
      })
      expect(result).toBe(mockResultado)
      expect(service.update).toHaveBeenCalled()
    })
    it('Debe de dar error al no encontrar una categoria', async () => {
      const id = 'noexiste'
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException())
      await expect(
        controller.update(id, {
          nombre: 'ANIME',
        }),
      ).rejects.toThrow(NotFoundException)
    })
  })
  describe('remove', () => {
    it('Debe de eliminar una categoria', async () => {
      const mockResultado: Categoria = {
        id: '1',
        nombre: 'ANIME',
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
        funkos: [],
      }
      jest.spyOn(service, 'removeLogical').mockResolvedValue(mockResultado)
      const result = await controller.remove('1')
      expect(result).toBe(mockResultado)
      expect(service.removeLogical).toHaveBeenCalled()
    })
    it('Debe de dar error al no encontrar una categoria', async () => {
      const id = 'noexiste'
      jest
        .spyOn(service, 'removeLogical')
        .mockRejectedValue(new NotFoundException())
      await expect(controller.remove(id)).rejects.toThrow(NotFoundException)
    })
  })
})
