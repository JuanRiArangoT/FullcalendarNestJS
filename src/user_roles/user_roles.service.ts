import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRoles } from './entities/user_role.entity';
import { UsersService } from 'src/users/users.service';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class UserRolesService {
  constructor(
    @InjectRepository(UserRoles)
    private readonly userRolesRepository: Repository<UserRoles>,
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {}

  async create(userId: number, roleId: number) {
    const user = await this.usersService.findById(userId);
    const role = await this.rolesService.getRoleById(roleId);
    const userRole = new UserRoles();
    userRole.user = user;
    userRole.role = role;
    return await this.userRolesRepository.save(userRole);
  }
}
