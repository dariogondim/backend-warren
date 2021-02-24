import ICreateClienstHasUserDTO from '@modules/users_has_clients/dtos/ICreateClientHasUserDTO';
import ClientsHasUsers from '../infra/typeorm/entities/ClientsHasUsers';

export default interface IClientsHasUsersRepository {
  create(data: ICreateClienstHasUserDTO): Promise<ClientsHasUsers>;
}
