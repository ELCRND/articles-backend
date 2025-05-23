import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';
import { IsPasswordsMatchingConstraint } from 'src/common/decorators/is-passwords-matching-constraint.decorator';

export class RegisterDto {
  @ApiProperty({
    example: 'user',
    required: true,
  })
  @IsString({ message: 'Поле username должно быть строкой' })
  @IsNotEmpty({ message: 'Поле username не может быть пустым' })
  username: string;

  @ApiProperty({
    example: 'user@example.com',
    required: true,
  })
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

  @ApiProperty({
    example: '123456',
    description: 'Должен совпадать с полем password.',
    required: true,
    minLength: 6,
  })
  @IsString({ message: 'Пароль подтверждения должен быть строкой.' })
  @IsNotEmpty({ message: 'Поле подтверждения пароля не может быть пустым.' })
  @MinLength(6, {
    message: 'Пароль подтверждения должен содержать не менее 6 символов.',
  })
  @Validate(IsPasswordsMatchingConstraint, {
    message: 'Пароли не совпадают.',
  })
  passwordRepeat: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}
