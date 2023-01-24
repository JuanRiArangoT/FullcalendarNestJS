import { UserRoles } from './../user_roles/entities/user_role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Roles } from './entities/role.entity';
import { UserRolesService } from 'src/user_roles/user_roles.service';
import { Users } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Roles, UserRoles, Users])],
  controllers: [RolesController],
  providers: [RolesService, UserRolesService, UsersService],
})
export class RolesModule {}
