import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { ArticleService } from './article.service';

import { Public } from 'src/common/decorators/public.decorator';

import { Article } from 'src/mongoose/schemas/article.schema';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleResponseDto } from './dto/article-response.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Controller('article')
export class ArticleController {
  constructor(private readonly articlesService: ArticleService) {}

  @Public()
  @ApiOperation({ summary: 'Создать новую статью' })
  @ApiResponse({
    status: 201,
    description: 'Статья успешно создана',
    type: ArticleResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Неверные входные данные' })
  @Post('create')
  async createArticle(
    @Body() createArticleDto: CreateArticleDto,
  ): Promise<Article> {
    return this.articlesService.create(createArticleDto);
  }

  @Public()
  @ApiOperation({ summary: 'Получить все статьи' })
  @ApiResponse({
    status: 200,
    type: [ArticleResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Статья не найдена' })
  @Get()
  async findAllArticles(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<Article[] | null> {
    return this.articlesService.findAll(
      paginationQuery.skip,
      paginationQuery.limit,
    );
  }

  @ApiOperation({ summary: 'Поиск статей по ключевым словам' })
  @ApiResponse({
    status: 200,
    description: 'Найденные статьи',
    type: [ArticleResponseDto],
  })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Ключевые слова для поиска',
  })
  @Public()
  @Get('search')
  async searchArticles(@Query('q') query: string): Promise<Article[] | null> {
    if (!query) {
      return this.articlesService.findAll();
    }
    return this.articlesService.search(query);
  }

  @Public()
  @ApiOperation({ summary: 'Получить статью по ID' })
  @ApiResponse({
    status: 200,
    description: 'Найденная статья',
    type: ArticleResponseDto,
  })
  @Get('count')
  async getCountArticles(): Promise<number> {
    return this.articlesService.count();
  }

  @Public()
  @ApiOperation({ summary: 'Получить статью по ID' })
  @ApiResponse({
    status: 200,
    description: 'Найденная статья',
    type: ArticleResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Статья не найдена' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Article | null> {
    return this.articlesService.findOne(id);
  }
}
