import { MigrationInterface, QueryRunner, TableUnique } from 'typeorm';

export default class AddUniqueConstraintClientIdInUserHasClientTable1614262867606
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createUniqueConstraint(
      'clients_has_users',
      new TableUnique({
        name: 'clientIdUnique',
        columnNames: ['client_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropUniqueConstraint(
      'clients_has_users',
      'clientIdUnique',
    );
  }
}
