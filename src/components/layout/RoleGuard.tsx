"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  allowedRoles: string[];
  children: React.ReactNode;
}

export default function RoleGuard({ allowedRoles, children }: Props) {
  const { user, accessToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If no user or token, redirect to login
    const tokenCookie = Cookies.get("accessToken") ?? null;
    const roleCookie = Cookies.get("role") ?? null;
    if ((!user || !accessToken) && !tokenCookie) {
      router.replace("/auth/login");
      return;
    }

    // Check if user's role is allowed
    // SUPER_ADMIN can access ADMIN routes
    const currentRole = user?.role ?? roleCookie ?? "";
    const isAllowed =
      allowedRoles.includes(currentRole) ||
      (currentRole === "SUPER_ADMIN" && allowedRoles.includes("ADMIN"));

    if (!isAllowed) {
      // Redirect to appropriate dashboard based on role
      switch (currentRole) {
        case "ADMIN":
        case "SUPER_ADMIN":
          router.replace("/admin/dashboard");
          break;
        case "INSTRUCTOR":
          router.replace("/instructor/dashboard");
          break;
        case "STUDENT":
          router.replace("/student/dashboard");
          break;
        default:
          router.replace("/auth/login");
      }
    }
  }, [user, accessToken, router, allowedRoles]);

  const tokenCookie = Cookies.get("accessToken") ?? null;
  if ((!user || !accessToken) && !tokenCookie) return null;

  return <>{children}</>;
}
