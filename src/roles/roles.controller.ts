import { Controller, Get, Param } from '@nestjs/common';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get(':id')
  async getRoleById(@Param('id') id: number) {
    return await this.rolesService.getRoleById(id);
  }
}
