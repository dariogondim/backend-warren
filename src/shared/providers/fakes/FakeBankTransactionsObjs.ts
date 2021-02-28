// eslint-disable-next-line import/prefer-default-export
export const userFake1 = {
  id: '4b0fe56d-d89e-4fe3-b631-fc1149c5cea4',
  name: 'John Doe',
  email: 'johndoe@example.com',
  password: '123123',
  clients_has_users_id: '76d41d2b-e765-4705-a131-c9916d72abab', // não faz parte da relação original
};

export const bankFake1 = {
  name: 'Banco do Brasil S.A.',
  cod: '001',
  id: '7d66f18b-f593-4758-a99f-3e458e74b7a4',
};

export const agencyFake1 = {
  id: '0df4edcb-db3e-43cb-894a-470095e912a5',
  name: 'Agência Barão de Aracati',
  cod: '36552',
  address:
    'r.barao de aracati,920 em frente a receita federal - meireles - fortaleza - ce',
  bank_id: '7d66f18b-f593-4758-a99f-3e458e74b7a4',
};

export const clientFake1 = {
  id: 'b3fe0e30-7eee-41a4-9d8b-65c04afcd8d6',
  fullname: 'Gilberto Pires Nolasco',
  cpf: '51831101319',
};

export const clienteHasUserFake1 = {
  id: '76d41d2b-e765-4705-a131-c9916d72abab',
  client_id: 'b3fe0e30-7eee-41a4-9d8b-65c04afcd8d6',
  user_id: '4b0fe56d-d89e-4fe3-b631-fc1149c5cea4',
};

export const profitabilityFake1 = {
  id: 'eb85f0f2-2526-4935-b005-78d048c599f7',
  description: 'Rendimento Diário max',
  type_profitability: 'daily',
  tax: 0.011,
};

export const bankAccountFake1 = {
  id: '50cde7c1-4e1e-44b1-aefc-671ce2b6c673',
  cc: '11812370',
  agency_id: '0df4edcb-db3e-43cb-894a-470095e912a5',
  client_id: 'b3fe0e30-7eee-41a4-9d8b-65c04afcd8d6',
  type: 'saving',
  profitability_id: 'eb85f0f2-2526-4935-b005-78d048c599f7',
};

export const bankAccountFake2 = {
  id: '1a2f0a9e-2167-4eb0-99fb-cc7c738dee97',
  cc: '10394516',
  agency_id: 'f978b2e4-fd61-4b8c-adaf-f5cbddc46102',
  client_id: 'ff977231-dafa-4c59-94dc-9b0089c8576c',
  type: 'currency',
  profitability_id: 'eb85f0f2-2526-4935-b005-78d048c599f7',
};

export const depositFake1 = {
  originTransaction: 'ted',
  channel: 'internet_banking',
  channelDescription: 'caixa 3 24 horas, shoping via sul',
  value: 1000.0,
  bank_account_sender_id: '50cde7c1-4e1e-44b1-aefc-671ce2b6c673',
  memo: 'salario fev',
};

export const paymentFake1 = {
  originTransaction: 'pix',
  channel: 'internet_banking',
  channelDescription: 'caixa 3 24 horas, shoping via sul,',
  value: 100.0,
  bank_account_sender_id: '50cde7c1-4e1e-44b1-aefc-671ce2b6c673',
  bank_account_recipient_id: '1a2f0a9e-2167-4eb0-99fb-cc7c738dee97',
  memo: 'transf pag serv',
};

export const paymentExternalFake1 = {
  originTransaction: 'pix',
  channel: 'internet_banking',
  channelDescription: 'caixa 3 24 horas, shoping via sul',
  value: 100.0,
  bank_account_sender_id: '50cde7c1-4e1e-44b1-aefc-671ce2b6c673',
  bank_destiny_id: '50cde7c1-4e1e-44b1-aefc-671ce2b6c673',
  agencyDestiny: '298400',
  accountDestiny: '234112201',
  cpfDestiny: '04867354321',
  memo: 'transf pag serv',
};

export const withdrawFake1 = {
  channel: 'internet_banking',
  channelDescription: 'caixa 3 24 horas, shoping via sul,',
  value: 500.0,
  bank_account_sender_id: '50cde7c1-4e1e-44b1-aefc-671ce2b6c673',
  memo: 'saque compras',
};

export const getBalanceFake1 = {
  bank_account_sender_id: '50cde7c1-4e1e-44b1-aefc-671ce2b6c673',
  from: '2021-02-01',
  to: '2021-02-28',
};
