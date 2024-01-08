import { INestApplication } from '@nestjs/common'
import { Categoria } from '../../../src/rest/categorias/entities/categoria.entity'
import { CreateCategoriaDto } from '../../../src/rest/categorias/dto/create-categoria.dto'
import { UpdateCategoriaDto } from '../../../src/rest/categorias/dto/update-categoria.dto'
import { Test } from '@nestjs/testing'
import { CategoriasController } from '../../../src/rest/categorias/categorias.controller'
import { CategoriasService } from '../../../src/rest/categorias/categorias.service'
import * as request from 'supertest'

describe('Categorias', () => {
  let app: INestApplication
  const endpoint = '/categorias'
  const categoria: Categoria = {
    id: 'fe5c570d-3120-4d53-bd7a-64da638b378c',
    nombre: 'Marvel',
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    funkos: [],
  }
  const createCategoria: CreateCategoriaDto = {
    nombre: 'Marvel',
  }
  const updateCategoria: UpdateCategoriaDto = {
    nombre: 'DC',
    isDeleted: false,
  }
  const mockCateService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    removeLogical: jest.fn(),
  }

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      controllers: [CategoriasController],
      providers: [
        CategoriasService,
        { provide: CategoriasService, useValue: mockCateService },
      ],
    })
      .overrideProvider(CategoriasService)
      .useValue(mockCateService)
      .compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })
  afterAll(async () => {
    await app.close()
  })

  describe('GET /categorias', () => {
    it('Deberia devolver todas las categorias', async () => {
      mockCateService.findAll.mockResolvedValue([categoria])
      const { body } = await request(app.getHttpServer())
        .get(endpoint)
        .expect(200)
      expect(() => {
        expect(body).toEqual([categoria])
        expect(mockCateService.findAll).toHaveBeenCalled()
      })
    })
  })
  describe('GET /categorias/:id', () => {
    it('Deberia devolver una categoria', async () => {
      mockCateService.findOne.mockResolvedValue(categoria)
      const { body } = await request(app.getHttpServer())
        .get(`${endpoint}/${categoria.id}`)
        .expect(200)
      expect(() => {
        expect(body).toEqual(categoria)
        expect(mockCateService.findOne).toHaveBeenCalled()
      })
    })
  })
  describe('POST /categorias', () => {
    it('Deberia crear una categoria', async () => {
      mockCateService.create.mockResolvedValue(categoria)
      const { body } = await request(app.getHttpServer())
        .post(endpoint)
        .send(createCategoria)
        .expect(201)
      expect(() => {
        expect(body).toEqual(categoria)
        expect(mockCateService.create).toHaveBeenCalled()
      })
    })
  })
  describe('PUT /categorias/:id', () => {
    it('Deberia actualizar una categoria', async () => {
      mockCateService.update.mockResolvedValue(categoria)
      const { body } = await request(app.getHttpServer())
        .put(`${endpoint}/${categoria.id}`)
        .send(updateCategoria)
        .expect(200)
      expect(() => {
        expect(body).toEqual(categoria)
        expect(mockCateService.update).toHaveBeenCalled()
      })
    })
  })
  describe('DELETE /categorias/:id', () => {
    it('Deberia eliminar una categoria', async () => {
      mockCateService.removeLogical.mockResolvedValue(categoria)
      const { body } = await request(app.getHttpServer())
        .delete(`${endpoint}/${categoria.id}`)
        .expect(204)
      expect(() => {
        expect(body).toEqual(categoria)
        expect(mockCateService.removeLogical).toHaveBeenCalled()
      })
    })
  })
})
