import { Injectable } from '@nestjs/common'
import { CreateFunkoDto } from '../../dto/create-funko.dto'
import { CategoriaFunko, Funko } from '../../entities/funko.entity'
import { UpdateFunkoDto } from '../../dto/update-funko.dto'

@Injectable()
export class FunkoMapper {
  constructor() {}

  toFunkoFromCreate(createFunkoDto: CreateFunkoDto, id: number, categoria: CategoriaFunko): Funko {
    const newFunko: Funko = {
      id: id,
      nombre: createFunkoDto.nombre,
      precio: createFunkoDto.precio,
      cantidad: createFunkoDto.cantidad,
      imagen: createFunkoDto.imagen,
      categoria: categoria,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
      isDeleted: false,
    }
    newFunko.id = id
    return newFunko
  }

  toFunkoFromUpdate(funkoNuevo: UpdateFunkoDto, funkoViejo: Funko, id: number, categoria: CategoriaFunko): Funko {
    const funkoActualizado: Funko = {
      id: id,
      nombre: funkoNuevo.nombre ? funkoNuevo.nombre : funkoViejo.nombre,
      precio: funkoNuevo.precio ? funkoNuevo.precio : funkoViejo.precio,
      cantidad: funkoNuevo.cantidad ? funkoNuevo.cantidad : funkoViejo.cantidad,
      imagen: funkoNuevo.imagen ? funkoNuevo.imagen : funkoViejo.imagen,
      categoria: categoria,
      fechaCreacion: funkoViejo.fechaCreacion,
      fechaActualizacion: new Date(),
      isDeleted: funkoNuevo.isDeleted ? funkoNuevo.isDeleted : funkoViejo.isDeleted,
    }
    return funkoActualizado
  }
}
