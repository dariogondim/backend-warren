export default interface ICreatePaymentOutsideDTO {
  originTransaction: string;
  channel: string;
  channelDescription: string;
  value: number;
  typeTransaction: string;
  bank_account_sender_id: string; // de onde parte o pagamento/transferencia
  status: string; // gerado no service
  compensationDate: Date; // gerado no service
  memo: string;
  bank_destiny_id: string; // o banco de destino do pagamento, obrigatório se for pra outro banco
  agencyDestiny: string; // a agência de destino do pagamento,  obrigatório se for pra outro banco
  cpfDestiny: string; // o cpf de destino do pagamento, obrigatório se for pra outro banco
  accountDestiny: string; // a conta de destino do pagamento, obrigatório se for pra outro banco
}
