import { Injectable } from '@nestjs/common'
import { CreateFunkoDto } from '../../dto/create-funko.dto'
import { Categoria } from '../../../categorias/entities/categoria.entity'
import { Funko } from '../../entities/funko.entity'
import { plainToClass } from 'class-transformer'
import { ResponseFunkoDto } from '../../dto/response-funko.dto'

@Injectable()
export class FunkoMapper {
  toFunko(createFunkoDto: CreateFunkoDto, categoria: Categoria): Funko {
    const funko = plainToClass(Funko, createFunkoDto)
    return { ...funko, categoria }
  }
  toResponse(funko: Funko): ResponseFunkoDto {
    const dto = plainToClass(ResponseFunkoDto, funko)
    dto.categoria = funko.categoria.nombre
    return dto
  }
}
