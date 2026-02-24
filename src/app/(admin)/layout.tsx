"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      router.push("/unauthorized");
    }
  }, [user, router]);

  return <>{children}</>;
}
