import 'reflect-metadata';

import fakeDatabase from '@shared/providers/fakes/FakeDatabase';
import { container } from 'tsyringe';
import moment from 'moment';
import GetObjsTransactionsService from '../GetObjsTransactionsService';

// não tive tempo de concluir, sorry :(
describe('teste MONETIZED value function', () => {
  beforeEach(() => {
    fakeDatabase.resetDatabase();
  });

  it('Check MONETIZED value 100 in day 2021-02-24 and at 10% daily tax return balance expected today', async () => {
    const valueToMonetize = 100;
    const tax = 0.1;
    const dtRefBalance: Date = moment('2021-02-24 00:00:00').toDate();

    const getObjsService = container.resolve(GetObjsTransactionsService);
    const valueMonetized = getObjsService.getMonetizedValue(
      valueToMonetize,
      tax,
      dtRefBalance,
    );

    await expect(valueMonetized).toEqual(10);
  });
});
