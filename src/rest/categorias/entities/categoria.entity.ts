import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Funko } from '../../funkos/entities/funko.entity'

@Entity({ name: 'categorias' })
export class Categoria {
  @PrimaryColumn({ type: 'uuid' })
  id: string

  @Column({ type: 'varchar', length: 255, unique: true })
  nombre: string

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date

  @Column({ type: 'boolean', default: true, name: 'is_deleted' })
  isDeleted: boolean

  @OneToMany(() => Funko, (funko) => funko.categoria)
  funkos: Funko[]
}
