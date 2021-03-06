import BankAccount from '@modules/bankAccounts/infra/typeorm/entities/BankAccount';
import { Entity, Column, ObjectIdColumn } from 'typeorm';
import ProfitabilityCopy from './ProfitabilityCopy';

@Entity('bank_accounts')
class BankAccountCopy extends BankAccount {
  @ObjectIdColumn()
  id: string;

  @Column()
  cc: string;

  @Column()
  type: 'currency' | 'saving';

  @Column('uuid')
  profitability_id: string;

  @Column(type => ProfitabilityCopy)
  profitability: ProfitabilityCopy;
}

export default BankAccountCopy;
