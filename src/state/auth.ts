import { atomWithStorage } from "jotai/utils";
import type { IUser } from "@/types/auth.type";

export type AuthState = {
  user: IUser | null;
};

export const authAtom = atomWithStorage<AuthState>("auth", { user: null });
