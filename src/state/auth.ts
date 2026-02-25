import { atom } from "jotai";
import type { IUser } from "@/types/auth.type";

export type AuthState = {
  user: IUser | null;
};

// Use a simple atom instead of atomWithStorage to avoid hydration issues
// Storage will be handled by cookies instead
export const authAtom = atom<AuthState>({ user: null });
