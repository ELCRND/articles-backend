import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

import { UserService } from '../user/user.service';

import { CreateArticleDto } from './dto/create-article.dto';
import { Article, ArticleDocument } from 'src/mongoose/schemas/article.schema';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name)
    private readonly articleModel: Model<ArticleDocument>,
    private readonly userService: UserService,
  ) {}

  public async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const existUser = await this.userService.getUserById(
      createArticleDto.authorId,
    );

    if (!existUser) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    const createdArticle = new this.articleModel({
      ...createArticleDto,
      author: existUser._id, // Используем ObjectId
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

  public async findOne(id: string): Promise<Article | null> {
    return this.articleModel
      .findById(new ObjectId(id))
      .populate('author', 'id username avatar')
      .exec();
  }

  public async search(keyword: string): Promise<Article[]> {
    return this.articleModel
      .find({
        $or: [
          { title: { $regex: keyword, $options: 'i' } },
          { content: { $regex: keyword, $options: 'i' } },
        ],
      })
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
    return this.articleModel.countDocuments().exec();
  }
}
