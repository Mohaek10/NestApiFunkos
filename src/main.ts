import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import * as process from 'process'
import * as cors from 'cors'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix(process.env.VERSION || 'api')
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(`${process.env.PUERTO}`)
  app.use(cors())
}

bootstrap().then(() =>
  console.log(`Servidor en ejecucion en el puerto: ${process.env.PUERTO} 👍`),
)
