import { injectable, inject } from 'tsyringe';

import ClientsHasUsers from '../infra/typeorm/entities/ClientsHasUsers';
import IClientsHasUsersRepository from '../repositories/IClientsHasUsersRepository';

interface IRequest {
  user_id: string;
  client_id: string;
}

@injectable()
class CreateClientsHasUsersService {
  constructor(
    @inject('ClientsHasUsersRepository')
    private usersRepository: IClientsHasUsersRepository,
  ) {}

  public async execute({
    user_id,
    client_id,
  }: IRequest): Promise<ClientsHasUsers> {
    const clientHasUser = await this.usersRepository.create({
      user_id,
      client_id,
    });

    return clientHasUser;
  }
}

export default CreateClientsHasUsersService;
