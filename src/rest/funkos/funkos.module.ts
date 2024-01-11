import { Logger, Module } from '@nestjs/common'
import { FunkosService } from './funkos.service'
import { FunkosController } from './funkos.controller'
import { FunkoMapper } from './mappers/funko-mapper/funko-mapper'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Funko } from './entities/funko.entity'
import { Categoria } from '../categorias/entities/categoria.entity'
import { StorageModule } from '../storage/storage.module'
import { NotificationsModule } from '../websockets/notifications/notifications.module'
import { StorageService } from '../storage/storage.service'
import { CacheModule } from '@nestjs/cache-manager'

@Module({
  imports: [
    TypeOrmModule.forFeature([Funko]),
    TypeOrmModule.forFeature([Categoria]),
    StorageModule,
    NotificationsModule,
    CacheModule.register(),
  ],
  controllers: [FunkosController],
  providers: [FunkosService, Logger, FunkoMapper, StorageService],
})
export class FunkosModule {}
