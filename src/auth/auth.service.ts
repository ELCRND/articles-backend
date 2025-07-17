import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { hash, verify } from 'argon2';
import { CookieOptions, Response } from 'express';

import { UserService } from '../user/user.service';
import { Role, User, UserDocument } from 'src/mongoose/schemas/user.schema';
import { Session, SessionDocument } from 'src/mongoose/schemas/session.schema';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TokensDto } from './dto/tokens.dto';

@Injectable()
export class AuthService {
  private readonly accessTokenOptions: CookieOptions;
  private readonly refreshTokenOptions: CookieOptions;

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) {
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    this.accessTokenOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
    };

    this.refreshTokenOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };
  }

  async register(dto: RegisterDto, res: Response): Promise<User> {
    const existingUser = await this.userService.getUserByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Пользователь уже существует');
    }

    const hashedPassword = await hash(dto.password);

    const user = await this.userModel.create({
      username: dto.username || dto.email,
      email: dto.email,
      password: hashedPassword,
      avatar: dto.avatar || '',
      role: Role.USER,
    });

    await this.issueNewTokens(user, res);
    return user;
  }

  async login(dto: LoginDto, res: Response): Promise<User> {
    const user = await this.userService.getUserByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    const passwordValid = await verify(user.password, dto.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Неверный пароль');
    }

    await this.issueNewTokens(user, res);

    return user;
  }

  async logout(userId: string, res: Response): Promise<void> {
    await this.sessionModel.deleteMany({ user: new ObjectId(userId) }).exec();
    this.clearTokens(res);
  }

  async refreshTokens(refreshToken: string, res: Response): Promise<User> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token не предоставлен');
    }

    const payload = await this.verifyRefreshToken(refreshToken);
    const user = await this.getUserIfExists(payload.sub);
    await this.validateSession(payload.sub);

    await this.issueNewTokens(user, res);
    return user;
  }

  private async verifyRefreshToken(token: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      }) as JwtPayload;
    } catch (e) {
      throw new UnauthorizedException('Недействительный refresh token');
    }
  }

  private async getUserIfExists(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(new ObjectId(userId)).exec();
    if (!user) {
      throw new UnauthorizedException('Пользователь не существует');
    }
    return user;
  }

  private async validateSession(userId: string): Promise<void> {
    const session = await this.sessionModel
      .findOne({ user: new ObjectId(userId) })
      .exec();
    if (!session) {
      throw new UnauthorizedException(
        'Сессия не найдена. Пожалуйста, войдите снова.',
      );
    }
  }

  private async issueNewTokens(user: User, res: Response): Promise<void> {
    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);
    this.setTokensCookies(res, tokens);
  }

  private async generateTokens(user: {
    _id: ObjectId;
    email: string;
    role: Role;
  }): Promise<TokensDto> {
    const payload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
        expiresIn: this.configService.getOrThrow<string>('JWT_EXPIRES_IN'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
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
    await this.sessionModel.findOneAndUpdate(
      { user: new ObjectId(userId) },
      {
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      { upsert: true, new: true },
    );
  }

  private setTokensCookies(res: Response, tokens: TokensDto): void {
    res.cookie('access_token', tokens.accessToken, this.accessTokenOptions);
    res.cookie('refresh_token', tokens.refreshToken, this.refreshTokenOptions);
  }

  private clearTokens(res: Response): void {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
  }
}
