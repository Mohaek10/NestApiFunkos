import { Injectable } from '@nestjs/common'
import { CreateFunkoDto } from '../../dto/create-funko.dto'
import { Categoria } from '../../../categorias/entities/categoria.entity'
import { Funko } from '../../entities/funko.entity'
import { plainToClass } from 'class-transformer'
import { ResponseFunkoDto } from '../../dto/response-funko.dto'
import { UpdateFunkoDto } from '../../dto/update-funko.dto'
import { FunkosNotificationDto } from '../../../websockets/notifications/dto/funkos-notificacion.dto'

@Injectable()
export class FunkoMapper {
  toFunko(createFunkoDto: CreateFunkoDto, categoria: Categoria): Funko {
    const funko = plainToClass(Funko, createFunkoDto)
    funko.categoria = categoria
    return funko
  }
  toResponse(funko: Funko): ResponseFunkoDto {
    const dto = plainToClass(ResponseFunkoDto, funko)
    if (funko.categoria && funko.categoria.nombre) {
      dto.categoria = funko.categoria.nombre
    } else {
      dto.categoria = null
    }

    return dto
  }

  toFunkoFromUpdate(
    funko: Funko,
    updateFunkoDto: UpdateFunkoDto,
    categoria: Categoria,
  ): Funko {
    const funkoUpdate = plainToClass(Funko, updateFunkoDto)
    funkoUpdate.id = funko.id
    funkoUpdate.categoria = categoria
    return funkoUpdate
  }
  toNotificationDto(funko: Funko): FunkosNotificationDto {
    const dto = plainToClass(FunkosNotificationDto, funko)
    if (funko.categoria && funko.categoria.nombre) {
      dto.categoria = funko.categoria.nombre
    } else {
      dto.categoria = null
    }
    return dto
  }
}
