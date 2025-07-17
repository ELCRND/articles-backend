import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

import { UserService } from '../user/user.service';

import { CreateArticleDto } from './dto/create-article.dto';
import { Article, ArticleDocument } from 'src/mongoose/schemas/article.schema';
import { ArticleFilterDto } from './dto/article-filter.dto';
import { UnpublishedArticleResponseDto } from './dto/article-response.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name)
    private readonly articleModel: Model<ArticleDocument>,
    private readonly userService: UserService,
  ) {}

  public async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const existUser = await this.userService.getUserByEmail(
      createArticleDto.email,
    );

    if (!existUser) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    // текст для поиска
    const plainText = this.extractPlainText(createArticleDto.content);

    const createdArticle = new this.articleModel({
      ...createArticleDto,
      image: createArticleDto.image || '',
      plainText,
      author: existUser._id,
      published: false,
      readingTime: createArticleDto.readingTime || 4,
    });

    return createdArticle.save();
  }

  public async findAll(skip?: number, limit?: number): Promise<Article[]> {
    return this.articleModel
      .find()
      .populate('author', 'id username avatar')
      .sort({ _id: -1 })
      .skip(skip || 0)
      .limit(limit || 0)
      .exec();
  }

  public async getPublishedArticles(
    skip?: number,
    limit?: number,
  ): Promise<Article[]> {
    return this.articleModel
      .find({ published: true })
      .populate('author', 'id username avatar')
      .sort({ _id: -1 })
      .skip(skip || 0)
      .limit(limit || 0)
      .exec();
  }

  public async findOne(id: string): Promise<Article | null> {
    return this.articleModel
      .findById(new ObjectId(id))
      .populate('author', 'id username avatar')
      .exec();
  }

  public async search(keyword: string): Promise<Article[]> {
    return this.articleModel
      .find(
        {
          $text: {
            $search: keyword,
            $caseSensitive: false, // регистронезависимый поиск
            $diacriticSensitive: false, // игнорирование диакритических знаков
          },
        },
        {
          score: { $meta: 'textScore' }, // добавляем оценку релевантности
        },
      )
      .sort({ score: { $meta: 'textScore' } }) // сортируем по релевантности
      .populate('author', 'id username avatar')
      .exec();
  }

  public async update(
    id: string,
    updateData: Partial<Article>,
  ): Promise<Article | null> {
    return this.articleModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  public async remove(id: string): Promise<Article | null> {
    return this.articleModel.findByIdAndDelete(id).exec();
  }

  public async count(): Promise<number> {
    return this.articleModel.countDocuments({ published: true }).exec();
  }

  public async getUnpublishedArticles(
    filters: ArticleFilterDto,
  ): Promise<UnpublishedArticleResponseDto[]> {
    const query: any = { published: false };

    if (filters.categories?.length) {
      query.category = { $in: filters.categories };
    }
    if (filters.themes?.length) {
      query.theme = { $in: filters.themes };
    }
    if (filters.subthemes?.length) {
      query.subtheme = { $in: filters.subthemes };
    }
    if (filters.tags?.length) {
      query.tags = { $in: filters.tags };
    }
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { content: { $regex: filters.search, $options: 'i' } },
      ];
    }

    return this.articleModel
      .find(query)
      .select('id title createdAt')
      .populate('author', 'id username avatar')
      .sort({ _id: -1 })
      .exec();
  }

  private extractPlainText(content: Record<string, any>): string {
    if (!content?.content) return '';

    let text = '';
    const processNode = (node: any) => {
      if (node.text) {
        text += node.text + ' ';
      }
      if (node.content) {
        node.content.forEach(processNode);
      }
    };

    content.content.forEach(processNode);
    return text.trim();
  }
}
