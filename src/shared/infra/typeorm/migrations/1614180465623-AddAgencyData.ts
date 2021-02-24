import { MigrationInterface, QueryRunner } from 'typeorm';

export default class AddAgencyData1614180465623 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('agencies')
      .values([
        {
          id: '0df4edcb-db3e-43cb-894a-470095e912a5',
          name: 'Agência Barão de Aracati',
          cod: '36552',
          address:
            'r.barao de aracati,920 em frente a receita federal - meireles - fortaleza - ce',
          bank_id: '7d66f18b-f593-4758-a99f-3e458e74b7a4',
        },
        {
          id: 'a9f8660d-1516-40b0-886e-c4f4189d6793',
          name: 'Agência Osório de Paiva',
          cod: '29068',
          address: 'av.osorio de paiva,1371 - parangaba - fortaleza - ce',
          bank_id: '7d66f18b-f593-4758-a99f-3e458e74b7a4',
        },
        {
          id: '948ee330-5c92-457b-bb9c-38fefe47a5e8',
          name: 'Agência Maraponga',
          cod: '36544',
          address: 'rua francisco glicerio, 290 - fortaleza - ce',
          bank_id: '7d66f18b-f593-4758-a99f-3e458e74b7a4',
        },
        {
          id: '9a36f695-d901-4a2e-82bd-2b1c2a8a0c33',
          name: 'Agência Estilo',
          cod: '47368',
          address: 'r.uruguai,185 2.andar - centro - porto alegre - rs',
          bank_id: '7d66f18b-f593-4758-a99f-3e458e74b7a4',
        },
        {
          id: '625ace97-4f3c-46d3-b29e-35b59e29914c',
          name: 'Agência Avenida Júlio de Castilhos',
          cod: '35297',
          address: 'av.julio de castilhos,159 - centro - porto alegre - rs',
          bank_id: '7d66f18b-f593-4758-a99f-3e458e74b7a4',
        },
        {
          id: '24a08a94-1a19-4b97-b81c-0108c95b094c',
          name: 'Agência Avenida Independência',
          cod: '35300',
          address: 'av.independencia,851 - independencia - porto alegre - rs',
          bank_id: '7d66f18b-f593-4758-a99f-3e458e74b7a4',
        },
        {
          id: 'f978b2e4-fd61-4b8c-adaf-f5cbddc46102',
          name: 'Agência Zona norte',
          cod: ' 27979',
          address: 'av.assis brasil,6312 - sarandi - porto alegre - rs',
          bank_id: '7d66f18b-f593-4758-a99f-3e458e74b7a4',
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('agencies')
      .execute();
  }
}
