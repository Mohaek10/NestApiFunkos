import { Logger, Module } from '@nestjs/common';
import { FunkosService } from './funkos.service';
import { FunkosController } from './funkos.controller';

@Module({
  controllers: [FunkosController],
  providers: [FunkosService, Logger],
})
export class FunkosModule {}
