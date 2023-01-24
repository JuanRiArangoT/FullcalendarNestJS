import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Users } from 'src/users/entities/users.entity';
import { Clients } from 'src/clients/entities/client.entity';

@Entity({ name: 'appointments' })
export class Appointments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  start: Date;

  @Column()
  end: Date;

  @ManyToOne((type) => Users, (user) => user.appointments)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @ManyToOne((type) => Clients, (client) => client.appointments)
  @JoinColumn({ name: 'clientId' })
  client: Clients;
}
