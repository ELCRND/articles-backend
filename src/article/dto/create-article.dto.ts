import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  Category,
  Subtheme,
  Tag,
  Theme,
} from 'src/mongoose/schemas/article.schema';
import { Type } from 'class-transformer';

class TipTapContentDto {
  @ApiProperty({ type: Object })
  @IsArray()
  @IsNotEmpty()
  content: Record<string, any>;
}

export class CreateArticleDto {
  @ApiProperty({ example: 'Название статьи', description: 'Заголовок статьи' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    type: Object,
    description: 'Контент статьи в формате TipTap JSON',
    example: {
      type: 'doc',
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: 'Текст' }] },
      ],
    },
  })
  @IsObject()
  @IsNotEmpty()
  content: Record<string, any>;

  @ApiPropertyOptional({
    example: 'image.jpg',
    description: 'URL изображения статьи',
  })
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
    example: 'test2@mail.ru',
    description: 'email',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  duration?: string;
}
