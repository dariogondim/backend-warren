import Agency from '@modules/agencies/infra/typeorm/entities/Agency';
import Client from '@modules/clients/infra/typeorm/entities/Client';
import Profitability from '@modules/profitabilities/infra/typeorm/entities/Profitability';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity('bank_accounts')
class BankAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cc: string;

  @Column()
  type: 'currency' | 'saving';

  @Column()
  profitability_id: string;

  @ManyToOne(() => Profitability)
  @JoinColumn({ name: 'profitability_id' })
  profitability: Profitability;

  @Column()
  agency_id: string;

  @ManyToOne(() => Agency)
  @JoinColumn({ name: 'agency_id' })
  agency: Agency;

  @Column()
  client_id: string;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default BankAccount;
