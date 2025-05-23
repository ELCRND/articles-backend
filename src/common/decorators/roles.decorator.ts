import { SetMetadata } from '@nestjs/common';
import { Role } from 'prisma/__prisma-generated__';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
