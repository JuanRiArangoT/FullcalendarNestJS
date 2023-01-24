import { Controller, Post, Body, Param } from '@nestjs/common';
import { UserRolesService } from './user_roles.service';

@Controller('user_roles')
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  @Post(':userId/:roleId')
  async create(
    @Param('userId') userId: number,
    @Param('roleId') roleId: number,
  ) {
    return await this.userRolesService.create(userId, roleId);
  }
}
