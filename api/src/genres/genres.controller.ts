import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';

import { GenresService } from './genres.service.js';
import { CreateGenreDto } from './dto/create-genre.dto.js';
import { UpdateGenreDto } from './dto/update-genre.dto.js';

@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  // GET /genres
  @Get()
  findAll() {
    return this.genresService.findAll();
  }

  // GET /genres/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.genresService.findOne(id);
  }

  // POST /genres
  @Post()
  create(@Body() createGenreDto: CreateGenreDto) {
    return this.genresService.create(createGenreDto);
  }

  // PATCH /genres/:id
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGenreDto: UpdateGenreDto,
  ) {
    return this.genresService.update(id, updateGenreDto);
  }

  // DELETE /genres/:id
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.genresService.remove(id);
  }
}