export default interface ICashOutAccountDTO {
  cashInUsername: string;
  cashOutUser: {
    username: string;
    accountId: string;
  };
  value: number;
}
