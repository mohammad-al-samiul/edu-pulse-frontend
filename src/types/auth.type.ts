export type UserRole = "SUPER_ADMIN" | "ADMIN" | "INSTRUCTOR" | "STUDENT";

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  user: IUser | null;
  accessToken: string | null;
}
