"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useAuth } from "@/hooks/useAuth";
import { DashboardSkeleton } from "@/components/ui/loading-skeleton";

interface Props {
  allowedRoles: string[];
  children: React.ReactNode;
}

export default function RoleGuard({ allowedRoles, children }: Props) {
  const { user, accessToken, isClient } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only run on client side
    if (!isClient) return;

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
  }, [user, accessToken, router, allowedRoles, isClient]);

  // During hydration or if not authenticated, show the same skeleton as DashboardShell
  if (!isClient || (!user && !accessToken)) {
    return <DashboardSkeleton />;
  }

  return <>{children}</>;
}
