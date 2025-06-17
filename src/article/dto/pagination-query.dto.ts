import { IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'skip должно быть числом' })
  @Min(0)
  skip?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'limit должно быть числом' })
  @Min(0)
  limit?: number = 0;
}
