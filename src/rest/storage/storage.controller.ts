import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { StorageService } from './storage.service'
import { diskStorage } from 'multer'
import * as process from 'process'
import { v4 as uuidv4 } from 'uuid'
import { Request, Response } from 'express'
import { FileInterceptor } from '@nestjs/platform-express'
import { extname } from 'path'

@Controller('storage')
export class StorageController {
  private readonly logger = new Logger(StorageController.name)

  constructor(private readonly storageService: StorageService) {}
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.env.SUBIRARCHIVOS || './uploads',
        filename: (req, file, cb) => {
          const fileName = uuidv4()
          const fileExt = extname(file.originalname)
          cb(null, `${fileName}${fileExt}`)
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(new BadRequestException('Fichero no soportado.'), false)
        } else {
          cb(null, true)
        }
      },
    }),
  )
  subirFichero(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    this.logger.log(`Subiendo fichero`)
    if (!file) {
      throw new BadRequestException('No se ha subido ningún fichero')
    }
    const version = process.env.VERSION ? `/${process.env.VERSION}` : ''
    const url = `${req.protocol}://${req.get('host')}${version}/storage/${
      file.filename
    }`
    console.log(url)

    return {
      originalname: file.originalname,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
      path: file.path,
      url,
    }
  }
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
