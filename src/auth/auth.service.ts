import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';

import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TokensDto } from './dto/tokens.dto';

import { JwtPayload } from './interfaces/jwt-payload.interface';

import { Role } from 'prisma/__prisma-generated__';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<TokensDto> {
    const existingUser = await this.userService.getUserByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Пользователь уже существуют');
    }

    const hashedPassword = await hash(dto.password);

    const user = await this.prismaService.user.create({
      data: {
        username: dto.username || dto.email,
        email: dto.email,
        password: hashedPassword,
        avatar: dto.avatar || '',
      },
    });

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async login(dto: LoginDto): Promise<TokensDto> {
    const user = await this.prismaService.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    const passwordValid = await verify(user.password, dto.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Неверный пароль');
    }

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.prismaService.session.deleteMany({
      where: { userId },
    });
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<TokensDto> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: { sessions: true },
    });

    if (!user || !user.sessions.length) {
      throw new UnauthorizedException(
        'Пользователь не существует или сессия была завершена, пожалуйста авторизуйтесь заново.',
      );
    }

    const refreshTokenMatches = user.sessions.some(
      (session) => session.refreshToken === refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException(
        'Сессия была завершена, пожалуйста авторизуйтесь заново.',
      );
    }

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  private async generateTokens(user: {
    id: string;
    email: string;
    role: Role;
  }): Promise<TokensDto> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
        expiresIn: this.configService.getOrThrow<string>('JWT_EXPIRES_IN'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
        expiresIn: this.configService.getOrThrow<string>(
          'REFRESH_TOKEN_EXPIRES_IN',
        ),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prismaService.session.upsert({
      where: { userId },
      update: { refreshToken, expiresAt },
      create: {
        refreshToken,
        userId,
        expiresAt,
      },
    });
  }
}
