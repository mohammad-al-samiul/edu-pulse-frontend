"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { useAuth } from "@/hooks/useAuth";

export default function InstructorLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, role, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (role !== "INSTRUCTOR") {
      router.replace("/unauthorized");
    }
  }, [isAuthenticated, role, router]);

  if (!user || role !== "INSTRUCTOR") {
    return null;
  }

  return <DashboardShell role="INSTRUCTOR">{children}</DashboardShell>;
}
