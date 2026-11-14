import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { UpdateBookDto } from './dto/update-book.dto.js';
import { Prisma } from '@prisma/client';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  // Add a new book
  async create(createBookDto: CreateBookDto) {
    return this.prisma.book.create({
      data: createBookDto,
    });
  }

  // Get all books, with optional filtering and pagination
  async findAll(
    genreId?: number,
    search?: string,
    page = 1,
    limit = 10,
  ) {
    const where: Prisma.BookWhereInput = {};

    if (genreId) {
      where.genreId = genreId;
    }

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          author: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const [books, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          genre: true,
        },
        orderBy: {
          title: 'asc',
        },
      }),
      this.prisma.book.count({ where }),
    ]);

    return {
      data: books,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Find one book by ID
  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        genre: true,
      },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }

    return book;
  }

  // Update a book
  async update(id: number, updateBookDto: UpdateBookDto) {
    await this.findOne(id);

    return this.prisma.book.update({
      where: { id },
      data: updateBookDto,
    });
  }

  // Delete a book
  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.book.delete({
      where: { id },
    });
  }
}