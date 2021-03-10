import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';
import CreateClientsHasUsersService from '@modules/users_has_clients/services/CreateClientsHasUsersService';
import { Transactional } from 'typeorm-transactional-cls-hooked';

import { classToClass } from 'class-transformer';

export default class SessionsController {
  @Transactional()
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password, client_id } = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    const createClientHasUser = container.resolve(CreateClientsHasUsersService);

    await createClientHasUser.execute({
      user_id: user.id,
      client_id,
    });

    return response.json(classToClass(user));
  }
}
