import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm'

export class Direccion {
  @Column({ type: 'varchar', length: 255, nullable: false })
  calle: string
  @Column({ type: 'varchar', length: 255, nullable: false })
  numero: string
  @Column({ type: 'varchar', length: 255 })
  ciudad: string
  @Column({ type: 'varchar', length: 255 })
  provincia: string
  @Column({ type: 'varchar', length: 255, nullable: false })
  pais: string
  @Column({ type: 'varchar', length: 255, nullable: false })
  codigoPostal: string
}

export class Cliente {
  @Column({ type: 'varchar', length: 255, nullable: false })
  nombre: string
  @Column({ type: 'varchar', length: 255, nullable: false })
  apellido: string
  @Column({ type: 'varchar', length: 255, nullable: false })
  telefono: string
  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string
  @Column(() => Direccion)
  direccion: Direccion
}

export class LineaPedido {
  @Column({ type: 'number', nullable: false })
  idFunko: number

  @Column({ type: 'number', nullable: false })
  precioFunko: number

  @Column({ type: 'number', nullable: false })
  cantidad: number

  @Column({ type: 'number', nullable: false })
  total: number
}
@Entity({ name: 'pedidos' })
export class Pedido {
  @ObjectIdColumn()
  _id: ObjectId
  @Column({ type: 'number', length: 255, nullable: false })
  idUsuario: number
  @Column(() => Cliente)
  cliente: Cliente
  @Column(() => LineaPedido)
  lineasPedido: LineaPedido[]
  @Column()
  totalItems: number
  @Column()
  totalPedido: number
  @Column({ type: 'date', nullable: false, default: Date.now() })
  createdAt: Date
  @Column({ type: 'date', nullable: false, default: Date.now() })
  updatedAt: Date
  @Column({ type: 'boolean', nullable: false, default: false })
  isDeleted: boolean
  constructor(pedidos?: Partial<Pedido>) {
    Object.assign(this, pedidos)
  }
}
