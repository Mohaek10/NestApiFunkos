import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FunkosService } from './funkos.service'
import { CreateFunkoDto } from './dto/create-funko.dto'
import { UpdateFunkoDto } from './dto/update-funko.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { v4 as uuidv4 } from 'uuid'
import * as process from 'process'
import { Request } from 'express'
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager'

@Controller('funkos')
@UseInterceptors(CacheInterceptor)
export class FunkosController {
  constructor(private readonly funkosService: FunkosService) {}

  @Get()
  @CacheKey('funkos')
  @CacheTTL(60)
  async findAll() {
    return await this.funkosService.findAll()
  }

  @Get(':id')
  @CacheKey('funko')
  @CacheTTL(60)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.funkosService.findOne(+id)
  }

  @Post()
  @HttpCode(201)
  async create(@Body() createFunkoDto: CreateFunkoDto) {
    const nuevoFunko = await this.funkosService.create(createFunkoDto)
    await this.funkosService.invalidateCacheKey('funkos')
    return nuevoFunko
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFunkoDto: UpdateFunkoDto,
  ) {
    const funkoActualizado = await this.funkosService.update(id, updateFunkoDto)
    await this.funkosService.invalidateCacheKey('funkos')
    await this.funkosService.invalidateCacheKey(`funko${id}`)
    return funkoActualizado
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    const funkoBorrado = await this.funkosService.remove(id)
    await this.funkosService.invalidateCacheKey('funkos')
    await this.funkosService.invalidateCacheKey(`funko${id}`)
    return funkoBorrado
  }

  @Patch('/imagen/:id')
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
  async actualizarImagen(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    console.log(file)
    if (!file) {
      throw new BadRequestException('No se ha enviado ningún fichero')
    }
    const funkoActualizado = this.funkosService.actualizarImagen(
      id,
      file,
      req,
      true,
    )
    await this.funkosService.invalidateCacheKey('funkos')
    await this.funkosService.invalidateCacheKey(`funko${id}`)
    return funkoActualizado
  }
}
