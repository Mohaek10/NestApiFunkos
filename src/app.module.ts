import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { FunkosModule } from './rest/funkos/funkos.module'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoriasModule } from './rest/categorias/categorias.module'
import { StorageController } from './rest/storage/storage.controller';
import { StorageService } from './rest/storage/storage.service';
import { StorageModule } from './rest/storage/storage.module';

@Module({
  imports: [
    FunkosModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DB || 'funko',
      autoLoadEntities: true,
      synchronize: true,
      entities: [`${__dirname}/**/*.entity{.ts,.js}`],
    }),
    CategoriasModule,
    StorageModule,
  ],
  controllers: [AppController, StorageController],
  providers: [AppService, StorageService],
})
export class AppModule {}
