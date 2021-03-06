import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ObjectID,
  ObjectIdColumn,
} from 'typeorm';
import BankAccountCopy from './BankAccountCopy';
import ProfitabilityCopy from './ProfitabilityCopy';

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

  @Column()
  typeTransaction: string;

  @Column()
  channelDescription: string;

  @Column()
  compensationDate: Date;

  @Column()
  agencyDestiny: string;

  @Column()
  cpfDestiny: string;

  @Column()
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

  // bank: Bank;
  // bankAccountSender: BankAccount;

  @Column(type => ProfitabilityCopy)
  profitability: ProfitabilityCopy;

  @Column(type => BankAccountCopy)
  bankAccountRecipient: BankAccountCopy;
}

export default BankTransactions;
