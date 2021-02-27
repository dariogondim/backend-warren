export default interface IRetrieveBankStatementItemDTO {
  balancePrev: number;
  amount: number;
  newBalance: number;
  dtRef: Date;
  typeTransaction: string;
  memo: string;
  balanceMonetizing?: number;
}
