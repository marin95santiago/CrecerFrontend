import { Account } from "../../schemas/Account";

export default function accountMapper(account: any | unknown): Account {
  return {
    entityId: account.entityId ?? '',
    account: account.account ?? 0,
    description: account.description ?? '',
    balance: account.balance ?? 0
  }
}
