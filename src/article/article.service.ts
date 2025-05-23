import { Injectable } from '@nestjs/common';

import { CreateArticleDto } from './dto/create-article.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArticleService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createArticleDto: CreateArticleDto) {
    return this.prismaService.article.create({
      data: {
        ...createArticleDto,
      },
    });
  }

  public async findAll() {
    return this.prismaService.article.findMany({
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
  }

  public async findOne(id: string) {
    return this.prismaService.article.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
  }

  // Другие методы (findOne, update, remove и т.д.)
}
