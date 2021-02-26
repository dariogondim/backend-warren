export default interface IFindBankStatementDTO {
  bank_account_sender_id: string; // de onde parte o saque
  from: string; // a data início do período do extrato
  to: string; // a data fim do período
}
