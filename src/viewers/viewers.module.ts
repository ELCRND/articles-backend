import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ViewersController } from './viewers.controller';
import { ViewersService } from './viewers.service';
import { Viewer, ViewerSchema } from 'src/mongoose/schemas/viewer.schema';
import { Article, ArticleSchema } from 'src/mongoose/schemas/article.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Viewer.name, schema: ViewerSchema },
      { name: Article.name, schema: ArticleSchema },
    ]),
  ],
  controllers: [ViewersController],
  providers: [ViewersService],
  exports: [ViewersService],
})
export class ViewersModule {}
