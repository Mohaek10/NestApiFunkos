import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('funko')
export class Funko {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255, nullable: false })
  nombre: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  precio: number

  @Column({ type: 'integer', default: 0 })
  cantidad: number

  @Column({ type: 'varchar', default: 'https://via.placeholder.com/150' })
  imagen: string

  categoria: CategoriaFunko

  @CreateDateColumn({
    type: 'timestamp',
    name: 'fecha_creacion',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaCreacion: Date

  @CreateDateColumn({
    type: 'timestamp',
    name: 'fecha_actualizacion',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  fechaActualizacion: Date

  @Column({ type: 'boolean', default: true, name: 'is_deleted' })
  isDeleted: boolean

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
