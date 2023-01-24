import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Users } from './entities/users.entity';
import { Roles } from 'src/roles/entities/role.entity';
import { RolesService } from 'src/roles/roles.service';
import { RolesController } from 'src/roles/roles.controller';
import { UserRoles } from 'src/user_roles/entities/user_role.entity';
import { UserRolesService } from 'src/user_roles/user_roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Roles, UserRoles])],
  controllers: [UsersController, RolesController],
  providers: [UsersService, RolesService, UserRolesService],
})
export class UsersModule {}
