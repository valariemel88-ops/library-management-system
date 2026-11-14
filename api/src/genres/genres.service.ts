import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { CreateGenreDto } from './dto/create-genre.dto.js';
import { UpdateGenreDto } from './dto/update-genre.dto.js';

@Injectable()
export class GenresService {
  constructor(private prisma: PrismaService) {}

  // Create a genre
  async create(createGenreDto: CreateGenreDto) {
    const existingGenre = await this.prisma.genre.findUnique({
      where: { name: createGenreDto.name },
    });

    if (existingGenre) {
      throw new ConflictException('This genre already exists');
    }

    return this.prisma.genre.create({
      data: createGenreDto,
    });
  }

  // Get all genres
  async findAll() {
    return this.prisma.genre.findMany({
      include: {
        _count: {
          select: { books: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  // Get one genre
  async findOne(id: number) {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
      include: {
        books: true,
      },
    });

    if (!genre) {
      throw new NotFoundException(`Genre with ID ${id} not found`);
    }

    return genre;
  }

  // Update a genre
  async update(id: number, updateGenreDto: UpdateGenreDto) {
    await this.findOne(id);

    if (updateGenreDto.name) {
      const existingGenre = await this.prisma.genre.findUnique({
        where: { name: updateGenreDto.name },
      });

      if (existingGenre && existingGenre.id !== id) {
        throw new ConflictException('This genre name is already in use');
      }
    }

    return this.prisma.genre.update({
      where: { id },
      data: updateGenreDto,
    });
  }

  // Delete a genre
  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.genre.delete({
      where: { id },
    });
  }
}