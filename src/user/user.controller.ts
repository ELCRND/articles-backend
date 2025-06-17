import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { SafeUser, UserService } from './user.service';

import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from 'src/mongoose/schemas/user.schema';

import { Request } from 'express';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('users')
// @UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  async getProfile(@Req() req: Request) {
    return this.userService.getMe(req);
  }

  @Get()
  @Roles(Role.ADMIN)
  async getAllUsers(): Promise<SafeUser[]> {
    return this.userService.getAllUsers();
  }

  @Public()
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<SafeUser | null> {
    return this.userService.getUserById(id);
  }
}
