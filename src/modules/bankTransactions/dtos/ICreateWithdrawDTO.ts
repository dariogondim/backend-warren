export default interface ICreateWithdrawDTO {
  originTransaction: string;
  channel: string;
  channelDescription: string;
  value: number;
  typeTransaction: string;
  bank_account_sender_id: string; // de onde parte o saque
  memo: string;
  status: string; // gerado no service
}
