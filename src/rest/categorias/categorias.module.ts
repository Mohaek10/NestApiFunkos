import { Module } from '@nestjs/common'
import { CategoriasService } from './categorias.service'
import { CategoriasController } from './categorias.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Categoria } from './entities/categoria.entity'
import { CategoriasMapper } from './mappers/categorias-mapper/categorias-mapper'
import { CacheModule } from '@nestjs/cache-manager'

@Module({
  imports: [TypeOrmModule.forFeature([Categoria]), CacheModule.register()],
  controllers: [CategoriasController],
  providers: [CategoriasService, CategoriasMapper],
  exports: [],
})
export class CategoriasModule {}
