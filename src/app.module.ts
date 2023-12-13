import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FunkosModule } from './rest/funkos/funkos.module';

@Module({
  imports: [FunkosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
