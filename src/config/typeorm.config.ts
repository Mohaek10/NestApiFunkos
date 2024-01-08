import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import * as process from 'process'

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB || 'funko',
  autoLoadEntities: true,
  entities: [`${__dirname}/**/*.entity{.ts,.js}`],
  synchronize: process.env.PERFIL !== 'prod',
  logging: process.env.PERFIL !== 'prod' ? 'all' : false,
}
