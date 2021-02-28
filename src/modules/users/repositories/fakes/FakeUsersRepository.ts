import { uuid } from 'uuidv4';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';
import fakeDatabase from '@shared/providers/fakes/FakeDatabase';
import User from '../../infra/typeorm/entities/User';

class FakeUsersRepository implements IUsersRepository {
  public async findById(id: string): Promise<User | undefined> {
    const findUser = fakeDatabase.fakeUsers.find(user => user.id === id);

    // por causa da relação com client_has_users
    if (findUser) {
      if (findUser.clients_has_users_id) {
        const clients_has_users = fakeDatabase.fakeClientsHasUsers.find(
          chu => chu.id === findUser.clients_has_users_id,
        );
        findUser.clients_has_users = [];
        if (clients_has_users) {
          findUser.clients_has_users.push(clients_has_users);
        }
      }
    }

    // deve ficar igual a consulta abaixo
    // const findAppointment = await this.ormRepository.findOne(id, {
    //   relations: ['clients_has_users'],
    // });
    return findUser;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = fakeDatabase.fakeUsers.find(user => user.email === email);

    return findUser;
  }

  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let users = fakeDatabase.fakeUsers;

    if (except_user_id) {
      users = fakeDatabase.fakeUsers.filter(user => user.id !== except_user_id);
    }

    return users;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: uuid() }, userData);

    fakeDatabase.fakeUsers.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const findIndex = fakeDatabase.fakeUsers.findIndex(
      findUser => findUser.id === user.id,
    );

    fakeDatabase.fakeUsers[findIndex] = user;

    return user;
  }
}

export default FakeUsersRepository;
