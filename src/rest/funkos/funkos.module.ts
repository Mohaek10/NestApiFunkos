import { Logger, Module } from '@nestjs/common'
import { FunkosService } from './funkos.service'
import { FunkosController } from './funkos.controller'
import { FunkoMapper } from './mappers/funko-mapper/funko-mapper'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Funko } from './entities/funko.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Funko])],
  controllers: [FunkosController],
  providers: [FunkosService, Logger, FunkoMapper],
})
export class FunkosModule {}
