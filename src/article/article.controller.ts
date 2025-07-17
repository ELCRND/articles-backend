import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { ArticleService } from './article.service';

import { Public } from 'src/common/decorators/public.decorator';

import { Article } from 'src/mongoose/schemas/article.schema';
import { CreateArticleDto } from './dto/create-article.dto';
import {
  ArticleResponseDto,
  UnpublishedArticleResponseDto,
} from './dto/article-response.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { plainToClass } from 'class-transformer';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/mongoose/schemas/user.schema';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ArticleFilterDto } from './dto/article-filter.dto';

@Controller('article')
export class ArticleController {
  constructor(private readonly articlesService: ArticleService) {}

  /**/
  /**/
  /** @Получить_все_опубликованные_статьи */
  /**/
  /**/
  @Public()
  @ApiOperation({ summary: 'Получить опубликованные статьи' })
  @ApiResponse({
    status: 200,
    type: [ArticleResponseDto],
  })
  @Get()
  async findPublishedArticles(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<Article[] | null> {
    return this.articlesService.getPublishedArticles(
      paginationQuery.skip,
      paginationQuery.limit,
    );
  }

  /**/
  /**/
  /** @Получить_все_статьи_для_админа */
  /**/
  /**/
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Получить все статьи' })
  @ApiResponse({
    status: 200,
    type: [ArticleResponseDto],
  })
  @Get('/all')
  async findAllArticles(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<Article[] | null> {
    return this.articlesService.findAll(
      paginationQuery.skip,
      paginationQuery.limit,
    );
  }

  /**/
  /**/
  /** @Получить_все_неопубликованные_статьи */
  /**/
  /**/
  @ApiOperation({ summary: 'Неопубликованные статьи' })
  @ApiResponse({
    status: 200,
    type: [UnpublishedArticleResponseDto],
  })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get('unpublished')
  async getUnpublishedArticles(
    @Query() filters: ArticleFilterDto,
  ): Promise<UnpublishedArticleResponseDto[]> {
    return this.articlesService.getUnpublishedArticles(filters);
  }

  /**/
  /**/
  /** @Поиск_по_ключевым_словам */
  /**/
  /**/
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

  /**/
  /**/
  /** @Получить_колличество_статей */
  /**/
  /**/
  @Public()
  @ApiOperation({ summary: 'Получить колличество статей' })
  @ApiResponse({
    status: 200,
    type: Number,
  })
  @Get('count')
  async getCountArticles(): Promise<number> {
    return this.articlesService.count();
  }

  /**/
  /**/
  /** @Получить_статью_по_ID */
  /**/
  /**/
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

  /**/
  /**/
  /** @Создать_новую_статью */
  /**/
  /**/
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
  ): Promise<ArticleResponseDto> {
    const article = await this.articlesService.create(createArticleDto);
    return plainToClass(ArticleResponseDto, article, {
      excludeExtraneousValues: true,
    });
  }
}
