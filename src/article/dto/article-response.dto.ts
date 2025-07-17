import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ObjectId } from 'mongodb';
import {
  Category,
  Subtheme,
  Tag,
  Theme,
} from 'src/mongoose/schemas/article.schema';
import { User } from 'src/mongoose/schemas/user.schema';

export class TipTapContentResponseDto {
  @ApiProperty({ type: Object })
  @Expose()
  content: Record<string, any>;
}

export class ArticleResponseDto {
  @ApiProperty({
    example: 'a1b2c3d4',
    description: 'Уникальный идентификатор статьи',
  })
  @Expose()
  id: string;

  @ApiProperty({ example: 'Название статьи', description: 'Заголовок статьи' })
  @Expose()
  title: string;

  @ApiProperty({
    type: TipTapContentResponseDto,
    description: 'Контент статьи в формате TipTap JSON',
  })
  @Expose()
  content: TipTapContentResponseDto;

  @ApiPropertyOptional({
    example: 'image.jpg',
    description: 'URL изображения статьи',
  })
  @Expose()
  image?: string;

  @ApiProperty({ example: Category.TECHNOLOGY, description: 'Раздел статьи' })
  @Expose()
  category: Category;

  @ApiProperty({ example: Theme.STARTUPS, description: 'Тема статьи' })
  @Expose()
  theme: Theme;

  @ApiProperty({ example: Subtheme.UX_UI, description: 'Подтема статьи' })
  @Expose()
  subtheme: Subtheme;

  @ApiProperty({
    example: [Tag.INNOVATION, Tag.TUTORIAL],
    description: 'Теги статьи',
    type: [String],
  })
  @Expose()
  tags: Tag[];

  @ApiProperty({
    example: '202b24f2-503a-49f8-a27a-a5a1a8bf54be',
    description: 'ID автора статьи',
  })
  @Expose()
  authorId: string;

  @ApiProperty({ example: 0, description: 'Количество просмотров' })
  @Expose()
  views: number;

  @ApiProperty({ example: 0, description: 'Количество комментариев' })
  @Expose()
  comments: number;

  @ApiProperty({ example: 4, description: 'Время чтения в минутах' })
  @Expose()
  readingTime: number;

  @ApiProperty({ example: true, description: 'Опубликована ли статья' })
  @Expose()
  published: boolean;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Дата создания',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-02T00:00:00.000Z',
    description: 'Дата последнего обновления',
  })
  @Expose()
  updatedAt: Date;
}

export class AuthorInfoDto {
  @ApiProperty({
    example: '202b24f2-503a-49f8-a27a-a5a1a8bf54be',
    description: 'ID автора',
  })
  @Expose()
  _id: ObjectId;

  @ApiProperty({
    example: 'username123',
    description: 'Имя пользователя автора',
  })
  @Expose()
  username: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'URL аватара автора',
  })
  @Expose()
  avatar?: string;
}

export class UnpublishedArticleResponseDto {
  @ApiProperty({
    example: 'a1b2c3d4',
    description: 'Уникальный идентификатор статьи',
  })
  @Expose()
  _id: ObjectId;

  @ApiProperty({ example: 'Название статьи', description: 'Заголовок статьи' })
  @Expose()
  title: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Дата создания',
  })
  @Expose()
  createdAt?: Date;

  @ApiProperty({
    type: AuthorInfoDto,
    description: 'Информация об авторе статьи',
  })
  @Expose()
  author: User | ObjectId;
}
