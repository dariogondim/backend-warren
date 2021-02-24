import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateClientHasUsers1614186515362
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'clients_has_users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'clients_id',
            type: 'uuid',
          },
          {
            name: 'users_id',
            type: 'uuid',
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
            name: 'ClientsId',
            referencedTableName: 'clients_has_users',
            referencedColumnNames: ['id'],
            columnNames: ['clients_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'UsersId',
            referencedTableName: 'clients_has_users',
            referencedColumnNames: ['id'],
            columnNames: ['users_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('clients_has_users');
  }
}
