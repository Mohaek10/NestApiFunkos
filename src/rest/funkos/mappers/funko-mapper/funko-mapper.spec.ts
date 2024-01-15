import { Test, TestingModule } from '@nestjs/testing'
import { FunkoMapper } from './funko-mapper'
import { Categoria } from '../../../categorias/entities/categoria.entity'
import { CreateFunkoDto } from '../../dto/create-funko.dto'
import { Funko } from '../../entities/funko.entity'
import { ResponseFunkoDto } from '../../dto/response-funko.dto'
import { FunkosNotificationDto } from '../../../websockets/notifications/dto/funkos-notificacion.dto'

describe('FunkoMapper', () => {
  let funkoMapper: FunkoMapper

  const categoriaEntity: Categoria = {
    id: '265d4504-b56c-4e13-adc6-8863dcb5d419',
    nombre: 'Marvel',
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    funkos: [],
  }
  const funkoCreado: CreateFunkoDto = {
    nombre: 'Spiderman',
    precio: 10000,
    cantidad: 10,
    imagen: 'imagen.jpg',
    categoria: categoriaEntity.nombre,
  }
  const funko: Funko = {
    id: 1,
    nombre: 'Spiderman',
    precio: 10000,
    cantidad: 10,
    imagen: 'imagen.jpg',
    fechaCreacion: new Date(),
    fechaActualizacion: new Date(),
    isDeleted: false,
    categoria: categoriaEntity,
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FunkoMapper],
    }).compile()

    funkoMapper = module.get<FunkoMapper>(FunkoMapper)
  })

  it('should be defined', () => {
    expect(funkoMapper).toBeDefined()
  })

  it('should map CreateFunkoDto to Funko', () => {
    const funkoEsperado: Funko = {
      ...funko,
      categoria: categoriaEntity,
    }
    const actualFunko: Funko = funkoMapper.toFunko(funkoCreado, categoriaEntity)
    expect(actualFunko.nombre).toEqual(funkoEsperado.nombre)
    expect(actualFunko.precio).toEqual(funkoEsperado.precio)
    expect(actualFunko.cantidad).toEqual(funkoEsperado.cantidad)
    expect(actualFunko.imagen).toEqual(funkoEsperado.imagen)
    expect(actualFunko.categoria).toEqual(funkoEsperado.categoria)
  })

  it('should map Funko to ResponseFunkoDto', () => {
    const funkoResponseEsperado: ResponseFunkoDto = {
      ...funko,
      categoria: categoriaEntity.nombre,
    }

    const actualFunkoResponse: ResponseFunkoDto = funkoMapper.toResponse(funko)
    expect(actualFunkoResponse).toBeInstanceOf(ResponseFunkoDto)
    expect(actualFunkoResponse.nombre).toEqual(funkoResponseEsperado.nombre)
    expect(actualFunkoResponse.precio).toEqual(funkoResponseEsperado.precio)
    expect(actualFunkoResponse.cantidad).toEqual(funkoResponseEsperado.cantidad)
    expect(actualFunkoResponse.imagen).toEqual(funkoResponseEsperado.imagen)
    expect(actualFunkoResponse.categoria).toEqual(
      funkoResponseEsperado.categoria,
    )
  })
  it('Devuelve toNotificationDto', () => {
    const funkoNotificationEsperado: FunkosNotificationDto = {
      ...funko,
      categoria: categoriaEntity.nombre,
    }
    const actualFunkoNotification: FunkosNotificationDto =
      funkoMapper.toNotificationDto(funko)
    expect(actualFunkoNotification).toBeInstanceOf(FunkosNotificationDto)
    expect(actualFunkoNotification.nombre).toEqual(
      funkoNotificationEsperado.nombre,
    )
    expect(actualFunkoNotification.precio).toEqual(
      funkoNotificationEsperado.precio,
    )
    expect(actualFunkoNotification.cantidad).toEqual(
      funkoNotificationEsperado.cantidad,
    )
    expect(actualFunkoNotification.imagen).toEqual(
      funkoNotificationEsperado.imagen,
    )
    expect(actualFunkoNotification.categoria).toEqual(
      funkoNotificationEsperado.categoria,
    )
  })
})
