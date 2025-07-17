import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

import { AuthService } from './auth.service';

import { GetCurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/mongoose/schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**/
  /**/
  /** @Регистрация */
  /**/
  /**/
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: RegisterDto,
  ): Promise<User> {
    return this.authService.register(dto, res);
  }

  /**/
  /**/
  /** @Вход */
  /**/
  /**/
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginDto,
  ): Promise<User> {
    return this.authService.login(dto, res);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @Res({ passthrough: true }) res: Response,
    @GetCurrentUser('id') userId: string,
  ) {
    return this.authService.logout(userId, res);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Body() body: { refreshToken: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refreshTokens(body.refreshToken, res);
  }

  @Get('verify')
  async verifyToken(@GetCurrentUser() user) {
    return { valid: true, user };
  }
}
