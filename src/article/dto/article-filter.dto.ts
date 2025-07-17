import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

import {
  Category,
  Subtheme,
  Tag,
  Theme,
} from 'src/mongoose/schemas/article.schema';

export class ArticleFilterDto {
  @ApiPropertyOptional({
    description: 'Filter by categories',
    enum: Category,
    isArray: true,
    // type: [Category], // Указываем, что может быть массивом
  })
  @IsEnum(Category, { each: true })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  categories?: Category[];

  @ApiPropertyOptional({
    description: 'Filter by themes',
    enum: Theme,
    isArray: true,
    // type: [Theme],
  })
  @IsEnum(Theme, { each: true })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  themes?: Theme[];

  @ApiPropertyOptional({
    description: 'Filter by subthemes',
    enum: Subtheme,
    isArray: true,
    // type: [Subtheme],
  })
  @IsEnum(Subtheme, { each: true })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  subthemes?: Subtheme[];

  @ApiPropertyOptional({
    description: 'Filter by tags',
    enum: Tag,
    isArray: true,
    // type: [Tag],
  })
  @IsEnum(Tag, { each: true })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  tags?: Tag[];

  @ApiPropertyOptional({
    description: 'Search by title or content',
  })
  @IsOptional()
  search?: string;
}
