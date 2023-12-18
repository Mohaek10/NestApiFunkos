export class Funko {
  id: number;
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
