import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  Category,
  Subtheme,
  Tag,
  Theme,
  User,
} from 'prisma/__prisma-generated__';

export class CreateArticleDto {
  @ApiProperty({ example: 'Название статьи', description: 'Заголовок статьи' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Содержание статьи...',
    description: 'Основной текст статьи',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    example: 'image.jpg',
    description: 'URL изображения статьи',
  })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ example: Category.TECHNOLOGY, description: 'Раздел статьи' })
  @IsString()
  @IsNotEmpty()
  category: Category;

  @ApiProperty({ example: Theme.STARTUPS, description: 'Тема статьи' })
  @IsString()
  @IsNotEmpty()
  theme: Theme;

  @ApiProperty({ example: Subtheme.UX_UI, description: 'Подтема статьи' })
  @IsString()
  @IsNotEmpty()
  subtheme: Subtheme;

  @ApiPropertyOptional({
    example: [Tag.INNOVATION, Tag.TUTORIAL],
    description: 'Теги статьи',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: Tag[];

  @ApiPropertyOptional({ example: 4, description: 'Время чтения в минутах' })
  @IsNumber()
  @IsOptional()
  readingTime?: number;

  @ApiPropertyOptional({
    example: false,
    description: 'Опубликована ли статья',
  })
  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @ApiProperty({
    example: '538a988d-2e2c-4de5-8e3e-aa3a5f80a386',
    description: 'Автор',
  })
  @IsString()
  @IsNotEmpty()
  authorId: string;
}
