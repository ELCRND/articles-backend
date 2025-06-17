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
import { Response } from 'express';

import { UserService } from '../user/user.service';
import { Role, User, UserDocument } from 'src/mongoose/schemas/user.schema';
import { Session, SessionDocument } from 'src/mongoose/schemas/session.schema';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TokensDto } from './dto/tokens.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) {}

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
    await this.sessionModel.deleteMany({ userId }).exec();
    this.clearTokens(res);
  }

  async refreshTokens(refreshToken: string, res: Response): Promise<User> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token не предоставлен');
    }
    console.log('refreshToken has', 0);

    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(refreshToken) as JwtPayload;
    } catch (e) {
      this.clearTokens(res);

      throw new UnauthorizedException('Недействительный refresh token');
    }

    console.log('refreshToken payload has', 1);

    const user = await this.userModel
      .findById(new ObjectId(payload.sub))
      .exec();
    if (!user) {
      throw new UnauthorizedException('Пользователь не существует');
    }

    console.log('refreshToken user has', 2);

    const session = await this.sessionModel
      .findOne({
        userId: payload.sub,
      })
      .exec();

    if (!session) {
      this.clearTokens(res);
      throw new UnauthorizedException(
        'Сессия не найдена. Пожалуйста, войдите снова.',
      );
    }

    console.log('refreshToken session has', 3);

    await this.issueNewTokens(user, res);

    console.log('refreshToken refresh has', 4);

    console.log('refreshToken', 10);
    return user;
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
      { userId },
      {
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      { upsert: true, new: true },
    );
  }

  private setTokensCookies(res: Response, tokens: TokensDto): void {
    const accessTokenMaxAge = 15 * 60 * 1000;
    const refreshTokenMaxAge = 7 * 24 * 60 * 60 * 1000;

    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
      maxAge: accessTokenMaxAge,
      expires: new Date(Date.now() + accessTokenMaxAge),
    });

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
      maxAge: refreshTokenMaxAge,
      expires: new Date(Date.now() + refreshTokenMaxAge),
    });
  }

  private clearTokens(res: Response): void {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    // res.cookie('access_token', 0, {
    //   httpOnly: true,
    //   secure: this.configService.get<string>('NODE_ENV') === 'production',
    //   sameSite: 'lax',
    //   maxAge: 0,
    // });

    // res.cookie('refresh_token', 0, {
    //   httpOnly: true,
    //   secure: this.configService.get<string>('NODE_ENV') === 'production',
    //   sameSite: 'lax',
    //   maxAge: 0,
    // });
  }
}
