import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';

import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role, User } from 'prisma/__prisma-generated__';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @Roles(Role.ADMIN)
  async getAllUsers(): Promise<Omit<User, 'password'>[] | null> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<Omit<User, 'password'>> {
    return this.userService.getUserById(id);
  }
}
