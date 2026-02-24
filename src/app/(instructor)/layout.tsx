"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/src/lib/store";

export default function InstructorLayout({
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

    if (user.role !== "INSTRUCTOR") {
      router.push("/unauthorized");
    }
  }, [user, router]);

  return <>{children}</>;
}
