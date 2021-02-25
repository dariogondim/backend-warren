import { MigrationInterface, QueryRunner } from 'typeorm';

export default class AddBankAccountsData1614183965880
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('bank_accounts')
      .values([
        {
          id: 'a4b671be-a892-4288-807f-9241bf0c8645',
          cc: '11702761',
          agency_id: '948ee330-5c92-457b-bb9c-38fefe47a5e8',
          client_id: 'a1345985-627f-4129-80bf-2e08e5daccda',
          type: 'currency',
          profitability_id: 'eb85f0f2-2526-4935-b005-78d048c599f7',
        },
        {
          id: '50cde7c1-4e1e-44b1-aefc-671ce2b6c673',
          cc: '11812370',
          agency_id: '0df4edcb-db3e-43cb-894a-470095e912a5',
          client_id: 'b3fe0e30-7eee-41a4-9d8b-65c04afcd8d6',
          type: 'saving',
          profitability_id: 'eb85f0f2-2526-4935-b005-78d048c599f7',
        },
        {
          id: 'c8e5a7f0-18d5-43ff-a92d-563a48f5d33e',
          cc: '2228688',
          agency_id: 'a9f8660d-1516-40b0-886e-c4f4189d6793',
          client_id: 'a1345985-627f-4129-80bf-2e08e5daccda',
          type: 'saving',
          profitability_id: null,
        },
        {
          id: '1a2f0a9e-2167-4eb0-99fb-cc7c738dee97',
          cc: '10394516',
          agency_id: 'f978b2e4-fd61-4b8c-adaf-f5cbddc46102',
          client_id: 'ff977231-dafa-4c59-94dc-9b0089c8576c',
          type: 'currency',
          profitability_id: 'eb85f0f2-2526-4935-b005-78d048c599f7',
        },
        {
          id: 'f62edd8f-9edd-495a-b909-34a8fe03761c',
          cc: '10007210',
          agency_id: '24a08a94-1a19-4b97-b81c-0108c95b094c',
          client_id: 'fd536c6f-26fd-4986-afb2-5332c0b5ed67',
          type: 'currency',
          profitability_id: 'eb85f0f2-2526-4935-b005-78d048c599f7',
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('bank_accounts')
      .execute();
  }
}
