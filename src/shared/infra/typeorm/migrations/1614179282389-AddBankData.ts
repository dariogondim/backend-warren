import { MigrationInterface, QueryRunner } from 'typeorm';

export default class AddBankData1614179282389 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('banks')
      .values([
        {
          id: '26df645a-76b5-42b4-ace2-e16ab1834cb3',
          name: 'Banco Bradesco S.A.',
          cod: '237',
        },
        {
          id: '7d66f18b-f593-4758-a99f-3e458e74b7a4',
          name: 'Banco do Brasil S.A.',
          cod: '001',
        },
        {
          id: '90bf2889-a137-4367-a766-0daa310de2b7',
          name: 'Banco do Nordeste do Brasil S.A.',
          cod: '004',
        },
        {
          id: 'cdee73b8-30c2-4df0-ac83-9325f9a11e8d',
          name: 'Itaú Unibanco S.A',
          cod: '341',
        },
        {
          id: '7720acde-35a4-40b6-acd4-dca8a4d9219f',
          name: 'Caixa Econômica Federal',
          cod: '104',
        },
        {
          id: '1474670f-3ed6-4a85-b803-2ece2665c330',
          name: 'Warren CVMC LTDA',
          cod: '371',
        },
        {
          id: '72b8bfcc-0d13-4b9b-b55d-6a0763c18768',
          name: 'Banco Santander Brasil S.A',
          cod: '033',
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('banks')
      .execute();
  }
}
