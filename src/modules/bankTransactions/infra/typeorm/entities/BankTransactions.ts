import BankAccount from '@modules/bankAccounts/infra/typeorm/entities/BankAccount';
import Bank from '@modules/banks/infra/typeorm/entities/Bank';
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

@Entity('bank_transactions')
class BankTransactions {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  status: string;

  @Column({ name: 'origin_transaction' })
  originTransaction: string;

  @Column()
  channel: string;

  @Column({ name: 'type_transaction' })
  typeTransaction: string;

  @Column({ name: 'channel_description' })
  channelDescription: string;

  @Column({ name: 'compensation_date' })
  compensationDate: Date;

  @Column({ name: 'agency_destiny' })
  agencyDestiny: string;

  @Column({ name: 'cpf_destiny' })
  cpfDestiny: string;

  @Column({ name: 'account_destiny' })
  accountDestiny: string;

  @Column()
  value: number;

  @Column()
  bank_destiny_id: string;

  @ManyToOne(() => Bank)
  @JoinColumn({ name: 'bank_destiny_id' })
  bank: Bank;

  @Column()
  bank_account_sender_id: string;

  @ManyToOne(() => BankAccount)
  @JoinColumn({ name: 'bank_account_sender_id' })
  bankAccountSender: BankAccount;

  @Column()
  bank_account_recipient_id: string;

  @ManyToOne(() => BankAccount)
  @JoinColumn({ name: 'bank_account_recipient_id' })
  bankAccountRecipient: BankAccount;

  @Column()
  profitability_id: string;

  @ManyToOne(() => Profitability)
  @JoinColumn({ name: 'profitability_id' })
  profitability: Profitability;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default BankTransactions;
