import { BANK_TRANSACTIONS2 } from '@modules/bankTransactions/infra/typeorm/constants/BankTransactions.constants';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateBankTransactions1614125648876
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'bank_transactions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'status',
            type: 'enum',
            enum: BANK_TRANSACTIONS2.status, // o status da transação
          },
          {
            name: 'origin_transaction',
            type: 'enum',
            enum: BANK_TRANSACTIONS2.originTransaction, // a origem da transação
          },
          {
            name: 'channel',
            type: 'enum',
            enum: BANK_TRANSACTIONS2.channel, // a origem da transação
          },
          {
            name: 'channel_description', // aalgo que identifique cada caixa eletronico, agencia bancária, etc
            type: 'varchar',
          },
          {
            name: 'compensation_date',
            type: 'timestamp',
          },
          {
            name: 'bank_account_sender_id',
            type: 'uuid',
          },
          {
            name: 'bank_account_recipient_id',
            type: 'uuid',
            isNullable: true, // o destinatário pode ser de outro banco ou o tipo não se aplica
          },
          {
            name: 'bank_destiny_id',
            type: 'uuid',
            isNullable: true, // usado quando o destinatário é para outro banco
          },
          {
            name: 'agency_destiny',
            type: 'varchar',
            isNullable: true, // usado quando o destinatário é para outro banco
          },
          {
            name: 'cpf_destiny',
            type: 'varchar',
            isNullable: true, // usado quando o destinatário é para outro banco
          },
          {
            name: 'account_destiny',
            type: 'varchar',
            isNullable: true, // usado quando o destinatário é para outro banco
          },
          {
            name: 'value',
            type: 'float',
          },
          {
            name: 'type_transaction',
            type: 'enum',
            enum: BANK_TRANSACTIONS2.typeTransaction, // o tipo do valor da transação
          },
          {
            name: 'profitability_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'BankAccountsSenderId',
            referencedTableName: 'bank_accounts',
            referencedColumnNames: ['id'],
            columnNames: ['bank_account_sender_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'BankAccountsRecipientId',
            referencedTableName: 'bank_accounts',
            referencedColumnNames: ['id'],
            columnNames: ['bank_account_recipient_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'ProfitabilyTransactionId',
            referencedTableName: 'profitability',
            referencedColumnNames: ['id'],
            columnNames: ['profitability_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'BankDestinyId',
            referencedTableName: 'banks',
            referencedColumnNames: ['id'],
            columnNames: ['bank_destiny_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('BANK_TRANSACTIONS2');
  }
}
