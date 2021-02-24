import { MigrationInterface, QueryRunner } from 'typeorm';

export default class AddClientsData1614182288806 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('clients')
      .values([
        {
          id: 'a1345985-627f-4129-80bf-2e08e5daccda',
          fullname: 'Luna Ferreira Cambezes',
          cpf: '39822507305',
        },
        {
          id: 'b3fe0e30-7eee-41a4-9d8b-65c04afcd8d6',
          fullname: 'Gilberto Pires Nolasco',
          cpf: '51831101319',
        },
        {
          id: 'ff977231-dafa-4c59-94dc-9b0089c8576c',
          fullname: 'Andressa Paião Neves',
          cpf: '22016672099',
        },
        {
          id: 'fd536c6f-26fd-4986-afb2-5332c0b5ed67',
          fullname: 'Arthur Lobato da Silva',
          cpf: '28749175084',
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('clients')
      .execute();
  }
}
