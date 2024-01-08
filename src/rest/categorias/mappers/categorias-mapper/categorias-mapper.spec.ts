import { Test, TestingModule } from '@nestjs/testing'
import { CategoriasMapper } from './categorias-mapper'
import { Categoria } from '../../entities/categoria.entity'

describe('CategoriasMapper', () => {
  let provider: CategoriasMapper

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriasMapper],
    }).compile()

    provider = module.get<CategoriasMapper>(CategoriasMapper)
  })

  it('should be defined', () => {
    expect(provider).toBeDefined()
  })
})

describe('CategoriasMapper', () => {
  let categoriasMapper: CategoriasMapper

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriasMapper],
    }).compile()
    categoriasMapper = module.get<CategoriasMapper>(CategoriasMapper)
  })

  it('should be defined', () => {
    expect(categoriasMapper).toBeDefined()
  })

  it('should map CreateCategoriaDto to Categoria', () => {
    const createCategoriaDto = {
      nombre: 'Categoria 1',
    }
    const expectedCategoria: Categoria = {
      id: 'cd00f18c-470e-4d2a-be5e-8de5e00d9ffc',
      nombre: 'Categoria 1',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      funkos: [],
    }
    const actualCategoria: Categoria =
      categoriasMapper.toEntity(createCategoriaDto)
    expect(actualCategoria.nombre).toEqual(expectedCategoria.nombre)
  })

  it('should map UpdateCategoriaDto to Categoria', () => {
    const updateCategoriaDto = {
      nombre: 'Categoria 1',
    }
    const expectedCategoria: Categoria = {
      id: 'cd00f18c-470e-4d2a-be5e-8de5e00d9ffc',
      nombre: 'Categoria 1',
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
      funkos: [],
    }
    const actualCategoria: Categoria =
      categoriasMapper.toEntity(updateCategoriaDto)
    expect(actualCategoria.nombre).toEqual(expectedCategoria.nombre)
  })
})
