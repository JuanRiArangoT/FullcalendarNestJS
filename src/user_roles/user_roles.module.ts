import { Module } from '@nestjs/common';
import { UserRolesService } from './user_roles.service';
import { UserRolesController } from './user_roles.controller';
import { UserRoles } from './entities/user_role.entity';
import { Users } from 'src/users/entities/users.entity';
import { Roles } from 'src/roles/entities/role.entity';
import { UsersService } from 'src/users/users.service';
import { RolesService } from 'src/roles/roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Roles, UserRoles, Users])],
  controllers: [UserRolesController],
  providers: [UserRolesService, UsersService, RolesService],
})
export class UserRolesModule {}
