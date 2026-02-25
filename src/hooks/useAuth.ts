"use client";

import { useAtomValue } from "jotai";
import { useState } from "react";
import { authAtom } from "@/state/auth";
import Cookies from "js-cookie";
import type { IUser } from "@/types/auth.type";

export function useAuth() {
  const { user } = useAtomValue(authAtom);

  // Lazy initialization - only runs on client
  const [authState] = useState(() => {
    if (typeof window === "undefined") {
      // Server-side - return safe defaults
      return {
        accessToken: null as string | null,
        role: null as string | null,
        isClient: false,
        user: null as IUser | null,
      };
    }

    // Client-side - read cookies and parse user if available
    const token = Cookies.get("accessToken") ?? null;
    const role = Cookies.get("role") ?? null;

    // Try to parse user from cookie if it exists
    let parsedUser: IUser | null = null;
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        parsedUser = JSON.parse(userCookie);
      } catch {
        // If parsing fails, ignore and use null
        parsedUser = null;
      }
    }

    return {
      accessToken: token,
      role: role,
      isClient: true,
      user: parsedUser,
    };
  });

  // Use user from atom if available, otherwise use parsed user from cookies
  const currentUser = user || authState.user;

  return {
    user: currentUser,
    accessToken: authState.accessToken,
    isAuthenticated: !!currentUser || !!authState.accessToken,
    role: currentUser?.role || authState.role,
    isClient: authState.isClient,
  };
}
