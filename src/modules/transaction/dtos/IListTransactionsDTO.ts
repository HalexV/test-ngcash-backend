export default interface IListTransactionsDTO {
  accountId: string;
  transactionDate?: Date;
  cashOutTransactions?: Boolean;
  cashInTransactions?: Boolean;
}
