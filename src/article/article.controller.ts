import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleResponseDto } from './dto/article-response.dto';
import { Article } from 'prisma/__prisma-generated__';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('article')
export class ArticleController {
  constructor(private readonly articlesService: ArticleService) {}

  @Public()
  @Post('create')
  @ApiOperation({ summary: 'Создать новую статью' })
  @ApiResponse({
    status: 201,
    description: 'Статья успешно создана',
    type: ArticleResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Неверные входные данные' })
  async create(@Body() createArticleDto: CreateArticleDto): Promise<Article> {
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Получить все статьи' })
  @ApiResponse({
    status: 200,
    type: [ArticleResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Статья не найдена' })
  async findAll(): Promise<Article[] | null> {
    return this.articlesService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Получить статью по ID' })
  @ApiResponse({
    status: 200,
    description: 'Найденная статья',
    type: ArticleResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Статья не найдена' })
  async findOne(@Param('id') id: string): Promise<Article | null> {
    return this.articlesService.findOne(id);
  }
}
