import { User } from "../../schemas/User";

export default function userMapper(user: any | unknown): User {
  return {
    id: user.id ?? '',
    email: user.email ?? '',
    password: user.password ?? '',
    name: user.name ?? '',
    lastname: user.lastname ?? '',
    entityId: user.entityId ?? '',
    state: user.state ?? '',
    permissions: user.permissions ?? [''],
    token: user.token ?? ''
  }
}
