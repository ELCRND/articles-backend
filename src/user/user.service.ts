import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'prisma/__prisma-generated__';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async getUserByEmail(email: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async getUserById(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error('Пользователь не найден');
    }

    return user;
  }

  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    return this.prismaService.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
