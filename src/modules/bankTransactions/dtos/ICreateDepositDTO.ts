export default interface ICreateDepositDTO {
  originTransaction: string;
  channel: string;
  channelDescription: string;
  value: number;
  typeTransaction: string;
  bank_account_sender_id: string; // de onde parte o depósito
  status: string; // gerado no service
  compensationDate: Date; // gerado no service
  memo: string;
  profitability_id?: string; // pode ser nulo se nao tiver rentabilidade
}
