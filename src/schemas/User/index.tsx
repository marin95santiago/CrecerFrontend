export enum Types {
  LOGIN = 'LOGIN'
};

export type UserPayload = {
  [Types.LOGIN]: {
    email: string;
    password: string;
  };
};

type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
  ? {
    type: Key;
  }
  : {
    type: Key;
    payload: M[Key];
  }
};

export type UserActions = ActionMap<UserPayload>[keyof ActionMap<UserPayload>];

export type UserContextType = {
  userContext: User;
  setUserContext: (value: User) => void;
};

export interface User {
  id: string
  email: string
  password?: string
  name: string
  lastname: string
  entityId: string
  state: string
  permissions: string[]
  token?: string
}
