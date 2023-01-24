import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from 'src/users/entities/users.entity';
import { Roles } from 'src/roles/entities/role.entity';

@Entity({ name: 'user_roles' })
export class UserRoles {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Users, (user) => user.roles)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @ManyToOne((type) => Roles, (role) => role.users)
  @JoinColumn({ name: 'roleId' })
  role: Roles;
}
