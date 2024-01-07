import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('funko')
export class Funko {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  precio: number;
  cantidad: number;
  imagen: string;
  categoria: CategoriaFunko;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  isDeleted: boolean;

  constructor() {}
}

export enum CategoriaFunko {
  DISNEY = 'DISNEY',
  MARVEL = 'MARVEL',
  DC = 'DC',
  ANIME = 'ANIME',
  SERIE = 'SERIE',
  OTROS = 'OTROS',
}
