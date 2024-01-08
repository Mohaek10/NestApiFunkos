import { Test, TestingModule } from '@nestjs/testing'
import { FunkosController } from './funkos.controller'
import { FunkosService } from './funkos.service'
import { ResponseFunkoDto } from './dto/response-funko.dto'
import { NotFoundException } from '@nestjs/common'
import { Funko } from './entities/funko.entity'

describe('FunkosController', () => {
  let controller: FunkosController
  let service: FunkosService

  beforeEach(async () => {
    const mockFunkosService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      borradoLogico: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FunkosController],
      providers: [
        {
          provide: FunkosService,
          useValue: mockFunkosService,
        },
      ],
    }).compile()

    controller = module.get<FunkosController>(FunkosController)
    service = module.get<FunkosService>(FunkosService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('findAll', () => {
    it('Debe de obtener todos los funkos', async () => {
      const mockResultado: Array<ResponseFunkoDto> = []
      jest.spyOn(service, 'findAll').mockResolvedValue(mockResultado)
      const result = await controller.findAll()
      expect(result).toBe(mockResultado)
      expect(service.findAll).toHaveBeenCalled()
    })
  })
  describe('findOne', () => {
    it('Debe de obtener un funko', async () => {
      const mockResultado: ResponseFunkoDto = {
        id: 1,
        nombre: 'Spiderman',
        precio: 12.5,
        cantidad: 10,
        categoria: 'MARVEL',
        imagen: 'imagen.jpg',
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
        isDeleted: false,
      }
      jest.spyOn(service, 'findOne').mockResolvedValue(mockResultado)
      const result = await controller.findOne(1)
      expect(result).toBe(mockResultado)
      expect(service.findOne).toHaveBeenCalled()
    })
    it('Debe de devolver un error si no existe el funko', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException())
      await expect(controller.findOne(1)).rejects.toThrow(NotFoundException)
      expect(service.findOne).toHaveBeenCalled()
    })
  })
  describe('create', () => {
    it('Debe de crear un funko', async () => {
      const mockResultado: ResponseFunkoDto = {
        id: 1,
        nombre: 'Spiderman',
        precio: 12.5,
        cantidad: 10,
        categoria: 'MARVEL',
        imagen: 'imagen.jpg',
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
        isDeleted: false,
      }
      jest.spyOn(service, 'create').mockResolvedValue(mockResultado)
      const result = await controller.create(mockResultado)
      expect(result).toBe(mockResultado)
      expect(service.create).toHaveBeenCalled()
    })
  })
  describe('update', () => {
    it('Debe de actualizar un funko', async () => {
      const mockResultado: ResponseFunkoDto = {
        id: 1,
        nombre: 'Spiderman',
        precio: 12.5,
        cantidad: 10,
        categoria: 'MARVEL',
        imagen: 'imagen.jpg',
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
        isDeleted: false,
      }
      jest.spyOn(service, 'update').mockResolvedValue(mockResultado)
      const result = await controller.update(1, mockResultado)
      expect(result).toBe(mockResultado)
      expect(service.update).toHaveBeenCalled()
    })
    it('Debe de devolver un error si no existe el funko', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException())
      await expect(controller.update(1, {})).rejects.toThrow(NotFoundException)
      expect(service.update).toHaveBeenCalled()
    })
  })

  describe('remove', () => {
    it('Debe de eliminar un funko', async () => {
      const id = 1
      const mockResultado: Funko = new Funko()
      mockResultado.id = id
      jest.spyOn(service, 'borradoLogico').mockResolvedValue(mockResultado)
      const result = await controller.remove(id)
      expect(result).toBe(mockResultado)
      expect(service.borradoLogico).toHaveBeenCalled()
      expect(service.borradoLogico).toHaveBeenCalledWith(id)
    })
    it('Debe de devolver un error si no existe el funko', async () => {
      jest
        .spyOn(service, 'borradoLogico')
        .mockRejectedValue(new NotFoundException())
      await expect(controller.remove(1)).rejects.toThrow(NotFoundException)
      expect(service.borradoLogico).toHaveBeenCalled()
    })
  })
})
