import BankAccount from '@modules/bankAccounts/infra/typeorm/entities/BankAccount';
import Bank from '@modules/banks/infra/typeorm/entities/Bank';
import Profitability from '@modules/profitabilities/infra/typeorm/entities/Profitability';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  ObjectID,
  ObjectIdColumn,
} from 'typeorm';

@Entity('bank_transactions')
class BankTransactions {
  @ObjectIdColumn()
  id: ObjectID;

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
  memo: string;

  @Column('uuid')
  bank_destiny_id: string;

  @Column('uuid')
  bank_account_sender_id: string;

  @Column('uuid')
  bank_account_recipient_id: string;

  @Column('uuid')
  profitability_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  bank: Bank;

  profitability: Profitability;

  bankAccountRecipient: BankAccount;

  bankAccountSender: BankAccount;
}

export default BankTransactions;
