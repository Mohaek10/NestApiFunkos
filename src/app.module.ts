import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FunkosModule } from './rest/funkos/funkos.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [FunkosModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
