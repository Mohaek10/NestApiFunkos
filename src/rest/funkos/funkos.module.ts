import { Logger, Module } from '@nestjs/common';
import { FunkosService } from './funkos.service';
import { FunkosController } from './funkos.controller';
import { FunkoMapper } from './mappers/funko-mapper/funko-mapper';

@Module({
  controllers: [FunkosController],
  providers: [FunkosService, Logger, FunkoMapper],
})
export class FunkosModule {}
