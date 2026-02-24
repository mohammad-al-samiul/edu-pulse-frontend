"use client";

import { useAppSelector } from "./reduxHooks";
import { IUser } from "@/types/auth.type";

export function useAuth() {
  const { user, accessToken } = useAppSelector((state) => state.auth);

  return {
    user: user as IUser | null,
    accessToken,
    isAuthenticated: !!user && !!accessToken,
    role: user?.role ?? null,
  };
}

