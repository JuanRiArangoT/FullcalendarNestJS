import { Appointments } from 'src/appointments/entities/appointment.entity';
import { Roles } from 'src/roles/entities/role.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column()
  @Column({ unique: true })
  document: number;

  @Column()
  password: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany((type) => Appointments, (appointment) => appointment.user, {
    onDelete: 'CASCADE',
  })
  appointments: Appointments[];

  @ManyToOne((type) => Roles, (role) => role.users)
  @JoinColumn({ name: 'roleId' })
  role: Roles;

  @ManyToMany((type) => Roles, (role) => role.users)
  @JoinTable({
    name: 'user_role',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'roleId',
      referencedColumnName: 'id',
    },
  })
  roles: Roles[];
}
