import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddMemoFieldInBankTransactions1614311362707
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'bank_transactions',
      new TableColumn({
        name: 'memo',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('bank_transactions', 'memo');
  }
}
