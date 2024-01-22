import { Logger, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { Funko } from '../../rest/funkos/entities/funko.entity'
import { Categoria } from '../../rest/categorias/entities/categoria.entity'
import { Pedido } from '../../rest/pedidos/entities/pedido.entity'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        type: 'postgres',
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
        username: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'postgres',
        database: process.env.POSTGRES_DB || 'funko',
        synchronize: true,
        entities: [Funko, Categoria],
        logging: false,
        connectionFactory: (connection) => {
          Logger.log('Conectado a la base de datos de Postgres  ')
          return connection
        },
      }),
    }),
    TypeOrmModule.forRoot({
      ...ConfigModule.forRoot({
        isGlobal: true,
      }),
      name: 'mongo',
      type: 'mongodb',
      host: process.env.MONGO_HOST || 'localhost',
      port: 27017,
      username: process.env.MONGO_USER || 'myoha',
      password: process.env.MONGO_PASSWORD || 'Moha123',
      database: process.env.MONGO_DB || 'funkos',
      synchronize: true,
      logging: true,
      autoLoadEntities: true,
      entities: [Pedido],
      retryAttempts: 5,
    }),
  ],
})
export class DatabaseModule {}
