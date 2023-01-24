import { Appointments } from 'src/appointments/entities/appointment.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'clients' })
export class Clients {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column()
  document: number;

  @OneToMany((type) => Appointments, (appointment) => appointment.client)
  appointments: Appointments[];
}
