import Bank from '../infra/typeorm/entities/Bank';

export default interface IBankRepository {
  findById(id: string): Promise<Bank | undefined>;
}
