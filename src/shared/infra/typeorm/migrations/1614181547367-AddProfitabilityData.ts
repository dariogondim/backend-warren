import { MigrationInterface, QueryRunner } from 'typeorm';

export default class AddProfitability1614181547367
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('profitability')
      .values([
        {
          id: 'eb85f0f2-2526-4935-b005-78d048c599f7',
          description: 'Rendimento Diário max',
          type_profitability: 'daily',
          tax: 0.011,
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('profitability')
      .execute();
  }
}
