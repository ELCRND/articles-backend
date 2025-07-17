import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Article } from 'src/mongoose/schemas/article.schema';
import { Viewer } from 'src/mongoose/schemas/viewer.schema';

@Injectable()
export class ViewersService {
  private readonly updateCooldown = 5 * 60 * 1000; // 5m
  private currentSlot = 0; // 0 или 1
  private readonly maxViewers = 2; // Максимальное количество просматриваемых статей

  constructor(
    @InjectModel(Viewer.name) private viewerModel: Model<Viewer>,
    @InjectModel(Article.name) private articleModel: Model<Article>,
  ) {}

  async trackView(articleId: Types.ObjectId): Promise<void> {
    const now = Date.now();
    const currentViews = await this.viewerModel
      .find()
      .sort({ lastViewed: 1 })
      .exec();

    // Если статья уже в списке, обновляем время
    const existing = currentViews.find(
      (v) => v.article && (v.article as Article)._id.equals(articleId),
    );
    if (existing) {
      existing.lastViewed = new Date();
      existing.expiresAt = new Date(now + 15 * 60 * 1000);
      await existing.save();
      return;
    }

    // Проверяем таймаут
    if (currentViews.length > 0) {
      const lastUpdate =
        currentViews[this.currentSlot]?.lastViewed?.getTime() || 0;
      if (now - lastUpdate < this.updateCooldown) {
        return;
      }
    }

    // Обновляем или создаем запись
    if (currentViews.length < this.maxViewers) {
      await this.viewerModel.create({
        article: articleId,
        lastViewed: new Date(),
        expiresAt: new Date(now + 15 * 60 * 1000),
      });
    } else {
      const toUpdate = currentViews[this.currentSlot];
      toUpdate.article = articleId;
      toUpdate.lastViewed = new Date();
      toUpdate.expiresAt = new Date(now + 15 * 60 * 1000);
      await toUpdate.save();
      this.currentSlot = (this.currentSlot + 1) % this.maxViewers;
    }
  }

  async getCurrentlyViewingArticles(): Promise<Article[]> {
    const now = Date.now();

    // Получаем текущие просматриваемые статьи
    let viewers = await this.viewerModel
      .find()
      .sort({ lastViewed: -1 })
      .limit(this.maxViewers)
      .populate({
        path: 'article',
        select: 'title readingTime comments views plainText',
      })
      .exec();

    // Фильтруем неактивные (старше 15 минут) и удаленные статьи
    viewers = viewers.filter((v) => {
      return (
        v.article &&
        v.lastViewed &&
        now - v.lastViewed.getTime() < 15 * 60 * 1000
      );
    });

    // Если статей меньше двух, добавляем случайные
    if (viewers.length < this.maxViewers) {
      const needed = this.maxViewers - viewers.length;
      const randomArticles = await this.getRandomArticles(
        needed,
        viewers.map((v) => (v.article as Article)._id),
      );

      // Создаем новые записи Viewer для случайных статей
      for (const article of randomArticles) {
        const newViewer = await this.viewerModel.create({
          article: article._id,
          lastViewed: new Date(),
          expiresAt: new Date(now + 15 * 60 * 1000),
        });

        viewers.push(await newViewer.populate('article'));
      }
    }

    // Возвращаем только статьи (без информации о Viewer)
    return viewers.slice(0, this.maxViewers).map((v) => v.article as Article);
  }

  private async getRandomArticles(
    count: number,
    excludeIds: Types.ObjectId[] = [],
  ): Promise<Article[]> {
    // Используем агрегацию для получения случайных статей
    const pipeline: any[] = [{ $sample: { size: count } }];

    if (excludeIds.length > 0) {
      pipeline.unshift({
        $match: {
          _id: { $nin: excludeIds },
        },
      });
    }

    return this.articleModel.aggregate(pipeline).exec();
  }
}
