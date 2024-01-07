import { Injectable } from '@nestjs/common'
import { CreateCategoriaDto } from '../../dto/create-categoria.dto'
import { UpdateCategoriaDto } from '../../dto/update-categoria.dto'
import { Categoria } from '../../entities/categoria.entity'
import { v4 as uuidv4 } from 'uuid'
import { plainToClass } from 'class-transformer'

@Injectable()
export class CategoriasMapper {
  toEntity(
    createCategoriaDto: CreateCategoriaDto | UpdateCategoriaDto,
  ): Categoria {
    const entidad = plainToClass(Categoria, createCategoriaDto)
    entidad.id = uuidv4()
    return entidad
  }
}
