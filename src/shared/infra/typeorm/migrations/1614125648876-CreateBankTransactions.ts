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
            enum: ['approved', 'pendent', 'canceled', 'rejected'], // o status da transação
          },
          {
            name: 'origin_transaction',
            type: 'enum',
            enum: ['ted', 'doc', 'pix'], // a origem da transação
          },
          {
            name: 'channel',
            type: 'enum',
            enum: [
              'internet_banking',
              'cash_machine',
              'app_bank',
              'agency_direct',
            ], // a origem da transação
          },
          {
            name: 'channel_id', // um id que identifique cada caixa eletronico, agencia bancária, etc
            type: 'varchar',
          },
          {
            name: 'compensationDate',
            type: 'timestamp',
          },
          {
            name: 'bank_transaction_id',
            type: 'uuid',
          },
          {
            name: 'bank_account_sender',
            type: 'uuid',
          },
          {
            name: 'bank_account_recipient',
            type: 'uuid',
            isNullable: true, // o destinatário pode ser de outro banco
          },
          {
            name: 'bank_id',
            type: 'uuid',
            isNullable: true, // usado quando o destinatário é para outro banco
          },
          {
            name: 'agency_id',
            type: 'varchar',
            isNullable: true, // usado quando o destinatário é para outro banco
          },
          {
            name: 'cpf_destiny',
            type: 'varchar',
            isNullable: true, // usado quando o destinatário é para outro banco
          },
          {
            name: 'account_id',
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
            enum: ['deposit', 'withdraw', 'payment', 'profitability'], // o tipo do valor da transação
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
            columnNames: ['bank_account_sender'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'BankAccountsRecipientId',
            referencedTableName: 'bank_accounts',
            referencedColumnNames: ['id'],
            columnNames: ['bank_account_recipient'],
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
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('bank_transactions');
  }
}
