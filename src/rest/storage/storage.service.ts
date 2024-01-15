import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import * as process from 'process'
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class StorageService {
  private readonly ficheroSubida = process.env.SUBIRARCHIVOS || './uploads'
  private readonly logger = new Logger(StorageService.name)
  private readonly isDev = process.env.PERFIL === 'dev'

  async onModuleInit() {
    if (this.isDev) {
      if (fs.existsSync(this.ficheroSubida)) {
        this.logger.log(`Eliminando fichero ${this.ficheroSubida}`)
        fs.readdirSync(this.ficheroSubida).forEach((file) => {
          fs.unlinkSync(path.join(this.ficheroSubida, file))
        })
      }
    }
  }

  obtenerTodasLasImagenesConUrls(): string[] {
    this.logger.log(`Obteniendo todas las imágenes`)
    const version = process.env.VERSION ? `/${process.env.VERSION}` : ''
    const url = `${process.env.PROTOCOLO}://${process.env.HOST}${version}/storage/`
    const ficheros = fs.readdirSync(this.ficheroSubida)
    const ficherosConUrl = ficheros.map((fichero) => `${url}${fichero}`)
    this.logger.log(`Ficheros con url ${ficherosConUrl}`)
    return ficherosConUrl
  }
  encontrarFichero(nombreFich: string): string {
    this.logger.log(`Buscando fichero ${nombreFich}`)
    const fichero = path.join(
      process.cwd(),
      process.env.SUBIRARCHIVOS,
      nombreFich,
    )
    if (fs.existsSync(fichero)) {
      this.logger.log(`Fichero encontrado ${nombreFich}`)
      return fichero
    } else {
      this.logger.log(`Fichero no encontrado ${nombreFich}`)
      throw new NotFoundException(`Fichero ${nombreFich} no encontrado`)
    }
  }
  // obtenerNombreFichero(nombreFich: string): string {
  //   this.logger.log(`Obteniendo nombre fichero ${nombreFich}`)
  //   const url = new URL(nombreFich)
  //   const pathName = url.pathname
  //   this.logger.log(`Nombre fichero ${pathName}`)
  //   return pathName.split('/').pop()
  // }
  borraFichero(nombreFich: string): void {
    this.logger.log(`Borrando fichero ${nombreFich}`)
    const file = path.join(process.cwd(), process.env.SUBIRARCHIVOS, nombreFich)
    this.logger.log(`Fichero a borrar ${file}`)
    if (fs.existsSync(file)) {
      fs.unlinkSync(file)
    } else {
      throw new NotFoundException(`Fichero ${nombreFich} no encontrado`)
    }
  }
}
