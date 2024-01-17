import { Module } from '@nestjs/common'
import { FunkosModule } from './rest/funkos/funkos.module'
import { ConfigModule } from '@nestjs/config'
import { CategoriasModule } from './rest/categorias/categorias.module'
import { StorageModule } from './rest/storage/storage.module'
import { NotificationsModule } from './rest/websockets/notifications/notifications.module'
import { CacheModule } from '@nestjs/cache-manager'
import { DatabaseModule } from './config/database/database.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    CacheModule.register(),
    FunkosModule,
    CategoriasModule,
    StorageModule,
    NotificationsModule,
  ],
})
export class AppModule {}
