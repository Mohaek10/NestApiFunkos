import { Controller, Get, Logger, Param, Res } from '@nestjs/common'
import { StorageService } from './storage.service'
import { Response } from 'express'

@Controller('storage')
export class StorageController {
  private readonly logger = new Logger(StorageController.name)

  constructor(private readonly storageService: StorageService) {}

  @Get(':nombreFich')
  obtenerFichero(
    @Param('nombreFich') nombreFich: string,
    @Res() res: Response,
  ) {
    this.logger.log(`Obteniendo fichero ${nombreFich}`)
    const fichero = this.storageService.encontrarFichero(nombreFich)
    this.logger.log(`Fichero obtenido ${nombreFich}`)
    res.sendFile(fichero)
  }

  @Get()
  obtenerTodosLosFicheros() {
    this.logger.log(`Obteniendo todos los ficheros con sus urls`)
    return this.storageService.obtenerTodasLasImagenesConUrls()
  }
}
