import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Category, Subtheme, Tag, Theme } from 'prisma/__prisma-generated__';

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
    example: 'Содержание статьи...',
    description: 'Основной текст статьи',
  })
  @Expose()
  content: string;

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
    example: '538a988d-2e2c-4de5-8e3e-aa3a5f80a386',
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
