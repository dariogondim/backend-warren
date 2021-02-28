import ClientsHasUsers from '@modules/users_has_clients/infra/typeorm/entities/ClientsHasUsers';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  avatar: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => ClientsHasUsers, clientsHasUsers => clientsHasUsers.user)
  clients_has_users: ClientsHasUsers[];

  clients_has_users_id?: string;
}

export default User;
