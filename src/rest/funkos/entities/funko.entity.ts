import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Categoria } from '../../categorias/entities/categoria.entity'

@Entity('funko')
export class Funko {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number

  @Column({ type: 'varchar', length: 255, nullable: false })
  nombre: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  precio: number

  @Column({ type: 'integer', default: 0 })
  cantidad: number

  @Column({ type: 'varchar', default: 'https://via.placeholder.com/150' })
  imagen: string

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

  @ManyToOne(() => Categoria, (categoria) => categoria.funkos)
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria
}
