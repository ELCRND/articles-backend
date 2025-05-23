import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    required: true,
  })
  @IsString({ message: 'Поле email должно быть строкой' })
  @IsNotEmpty({ message: 'Поле email не может быть пустым' })
  @IsEmail({}, { message: 'Некорректный email' })
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Пароль (минимум 6 символов).',
    required: true,
    minLength: 6,
  })
  @IsString({ message: 'Поле password должно быть строкой' })
  @IsNotEmpty({ message: 'Поле password не может быть пустым' })
  @MinLength(6, {
    message: 'Поле password должно содержать минимум 6 символов',
  })
  password: string;
}
