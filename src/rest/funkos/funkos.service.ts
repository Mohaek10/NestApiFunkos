import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateFunkoDto } from './dto/create-funko.dto';
import { UpdateFunkoDto } from './dto/update-funko.dto';
import { CategoriaFunko, Funko } from './entities/funko.entity';

@Injectable()
export class FunkosService {
  private readonly logger = new Logger(FunkosService.name);
  private arrayFunkos: Funko[] = [];

  constructor() {
    this.crearFunkos();
  }

  async create(createFunkoDto: CreateFunkoDto) {
    this.logger.log('Creando un funko');
    const categoriaIsValid = Object.values(CategoriaFunko).includes(
      createFunkoDto.categoria as CategoriaFunko,
    );
    if (!categoriaIsValid) {
      throw new BadRequestException(
        `La categoría '${createFunkoDto.categoria}' no es válida.`,
      );
    }

    const categoria = CategoriaFunko[createFunkoDto.categoria];

    const newFunko: Funko = {
      id: this.arrayFunkos.length + 1,
      ...createFunkoDto,
      categoria: categoria,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
      isDeleted: false,
    };

    this.arrayFunkos.push(newFunko);

    return newFunko;
  }

  async findAll() {
    this.logger.log('Buscando todos los funkos');
    return this.arrayFunkos;
  }

  async findOne(id: number) {
    this.logger.log('Buscando un funko');
    const buscarFunko = this.arrayFunkos.find((funko) => funko.id === id);

    if (!buscarFunko) {
      throw new NotFoundException(`Funko con id ${id} no encontrado`);
    }

    return buscarFunko;
  }

  update(id: number, updateFunkoDto: UpdateFunkoDto) {
    this.logger.log('Actualizando un funko');
    const idActual = this.arrayFunkos.findIndex((funko) => funko.id === id);
    let categoria: CategoriaFunko;
    if (updateFunkoDto.categoria !== undefined) {
      const categoriaIsValid = Object.values(CategoriaFunko).includes(
        updateFunkoDto.categoria as CategoriaFunko,
      );
      if (!categoriaIsValid) {
        throw new BadRequestException(
          `La categoría '${updateFunkoDto.categoria}' no es válida.`,
        );
      }

      categoria = CategoriaFunko[updateFunkoDto.categoria];
    }

    if (idActual !== -1) {
      this.arrayFunkos[idActual] = {
        ...this.arrayFunkos[idActual],
        ...updateFunkoDto,
        categoria: categoria,
        fechaActualizacion: new Date(),
      };
      return this.arrayFunkos[idActual];
    }

    throw new NotFoundException(`Funko con id ${id} no encontrado`);
  }

  remove(id: number) {
    const indiceACtual = this.arrayFunkos.findIndex((funko) => funko.id === id);

    if (indiceACtual !== -1) {
      const funkoBorrado = this.arrayFunkos.splice(indiceACtual, 1)[0];
      return funkoBorrado;
    }

    throw new NotFoundException(`Funko con id ${id} no encontrado`);
  }

  crearFunkos() {
    const inicialFunkos: CreateFunkoDto[] = [
      {
        nombre: 'Mickey Mouse',
        precio: 15.0,
        cantidad: 50,
        imagen: 'mickey.jpg',
        categoria: CategoriaFunko.DISNEY,
      },
      {
        nombre: 'Iron Man',
        precio: 24,
        cantidad: 30,
        imagen: 'ironman.jpg',
        categoria: CategoriaFunko.MARVEL,
      },
      {
        nombre: 'Batman',
        precio: 20,
        cantidad: 30,
        imagen: 'batman.jpg',
        categoria: CategoriaFunko.DC,
      },
      {
        nombre: 'Goku',
        precio: 20,
        cantidad: 30,
        imagen: 'goku.jpg',
        categoria: CategoriaFunko.ANIME,
      },
      {
        nombre: 'Stranger Things',
        precio: 20,
        cantidad: 30,
        imagen: 'strangerthings.jpg',
        categoria: CategoriaFunko.SERIE,
      },
      {
        nombre: 'Sailor Moon',
        precio: 20,
        cantidad: 30,
        imagen: 'sailormoon.jpg',
        categoria: CategoriaFunko.ANIME,
      },
      {
        nombre: 'Snoopy',
        precio: 20,
        cantidad: 30,
        imagen: 'snoopy.jpg',
        categoria: CategoriaFunko.DISNEY,
      },
      {
        nombre: 'Spiderman',
        precio: 20,
        cantidad: 30,
        imagen: 'spiderman.jpg',
        categoria: CategoriaFunko.MARVEL,
      },
      {
        nombre: 'Superman',
        precio: 20,
        cantidad: 30,
        imagen: 'superman.jpg',
        categoria: CategoriaFunko.DC,
      },
      {
        nombre: 'Thor',
        precio: 20,
        cantidad: 30,
        imagen: 'thor.jpg',
        categoria: CategoriaFunko.MARVEL,
      },
    ];

    inicialFunkos.forEach((funko) => this.create(funko));
  }
}
