"use client";

import { useAtomValue } from "jotai";
import { authAtom } from "@/state/auth";
import Cookies from "js-cookie";
import type { IUser } from "@/types/auth.type";

export function useAuth() {
  const { user } = useAtomValue(authAtom);
  const accessToken = Cookies.get("accessToken") ?? null;

  return {
    user: user as IUser | null,
    accessToken,
    isAuthenticated: !!user || !!accessToken,
    role: user?.role ?? Cookies.get("role") ?? null,
  };
}
