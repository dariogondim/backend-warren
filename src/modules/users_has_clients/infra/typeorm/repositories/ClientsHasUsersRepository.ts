import ICreateClientsHasUserDTO from '@modules/users_has_clients/dtos/ICreateClientHasUserDTO';
import IClientsHasUsersRepository from '@modules/users_has_clients/repositories/IClientsHasUsersRepository';
import { getRepository, Repository } from 'typeorm';
import ClientsHasUsers from '../entities/ClientsHasUsers';

class ClientsHasUsersRepository implements IClientsHasUsersRepository {
  private ormRepository: Repository<ClientsHasUsers>;

  constructor() {
    this.ormRepository = getRepository(ClientsHasUsers);
  }

  public async create(
    userData: ICreateClientsHasUserDTO,
  ): Promise<ClientsHasUsers> {
    const user = this.ormRepository.create(userData);

    await this.ormRepository.save(user);

    return user;
  }
}

export default ClientsHasUsersRepository;
