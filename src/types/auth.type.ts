import { Role, UserStatus } from "./enums";

export type UserRole = Role;
export { UserStatus };

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: UserStatus;
}

export interface AuthState {
  user: IUser | null;
  accessToken: string | null;
}
