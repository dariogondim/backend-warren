import Bank from '@modules/banks/infra/typeorm/entities/Bank';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity('agencies')
class Agency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  cod: string;

  @Column()
  address: string;

  @Column()
  bank_id: string;

  @ManyToOne(() => Bank)
  @JoinColumn({ name: 'bank_id' })
  bank: Bank;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Agency;
