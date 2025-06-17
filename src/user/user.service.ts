import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { User, UserDocument } from 'src/mongoose/schemas/user.schema';
import { ObjectId } from 'mongodb';

export type SafeUser = Omit<User, 'password'>;

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();

    return user;
  }

  async getUserById(id: string): Promise<SafeUser | null> {
    const user = await this.userModel
      .findById(new ObjectId(id))
      .select('-password')
      .lean()
      .exec();

    return user as SafeUser | null;
  }

  async getAllUsers(): Promise<SafeUser[]> {
    return this.userModel.find().select('-password').lean().exec();
  }

  public async getMe(req: Request): Promise<SafeUser | null> {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) throw new UnauthorizedException();

    const payload = this.jwtService.decode(token) as JwtPayload;

    return this.getUserById(payload.sub);
  }
}
