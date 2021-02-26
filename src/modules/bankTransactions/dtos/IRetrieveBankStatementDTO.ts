import IRetrieveBankStatementItemDTO from './IRetrieveBankStatementItemDTO';

export default interface IRetrieveBankStatementDTO {
  balance: number;
  extract: {
    from?: string;
    to?: string;
    objs: IRetrieveBankStatementItemDTO[];
  };
  bankAccount: {
    bank: string;
    agency: string;
    cc: string;
    client: string;
  };
}
