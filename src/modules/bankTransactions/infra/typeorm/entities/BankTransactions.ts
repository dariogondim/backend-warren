import Agency from '@modules/agencies/infra/typeorm/entities/Agency';
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
  status: 'approved' | 'pendent' | 'canceled' | 'rejected';

  @Column()
  origin_transaction: 'ted' | 'doc' | 'pix';

  @Column()
  channel: 'internet_banking' | 'cash_machine' | 'app_bank' | 'agency_direct';

  @Column()
  typeTransaction: 'deposit' | 'withdraw' | 'payment' | 'profitability';

  @Column()
  channel_id: string;

  @Column()
  compensationDate: Date;

  @Column()
  agency_id: string;

  @Column()
  cpf_destiny: string;

  @Column()
  account_id: string;

  @Column()
  value: number;

  @Column()
  bank_id: string;

  @ManyToOne(() => Bank)
  @JoinColumn({ name: 'bank_id' })
  bank: Bank;

  @Column()
  bank_account_sender: string;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'bank_account_sender' })
  bankAccountSender: BankAccount;

  @Column()
  bank_account_recipient: string;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'bank_account_recipient' })
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
