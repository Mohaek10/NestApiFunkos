import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common'
import { FunkosService } from './funkos.service'
import { CreateFunkoDto } from './dto/create-funko.dto'
import { UpdateFunkoDto } from './dto/update-funko.dto'

@Controller('funkos')
export class FunkosController {
  constructor(private readonly funkosService: FunkosService) {}

  @Get()
  async findAll() {
    return await this.funkosService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.funkosService.findOne(+id)
  }

  @Post()
  @HttpCode(201)
  async create(@Body() createFunkoDto: CreateFunkoDto) {
    return await this.funkosService.create(createFunkoDto)
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFunkoDto: UpdateFunkoDto,
  ) {
    return await this.funkosService.update(id, updateFunkoDto)
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.funkosService.remove(+id)
  }
}
