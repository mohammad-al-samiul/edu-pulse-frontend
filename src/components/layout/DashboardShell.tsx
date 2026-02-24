"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useLogoutUserMutation } from "@/features/auth/authApi";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

type DashboardShellProps = {
  children: ReactNode;
  role: "ADMIN" | "INSTRUCTOR" | "STUDENT";
};

const navConfig: Record<
  DashboardShellProps["role"],
  { label: string; href: string }[]
> = {
  ADMIN: [
    { label: "Overview", href: "/admin/dashboard" },
    { label: "Users", href: "/admin/users" },
    { label: "Categories", href: "/admin/categories" },
    { label: "Analytics", href: "/admin/analytics" },
  ],
  INSTRUCTOR: [
    { label: "Overview", href: "/instructor/dashboard" },
    { label: "My Courses", href: "/instructor/courses" },
    { label: "Create Course", href: "/instructor/courses/new" },
  ],
  STUDENT: [
    { label: "Dashboard", href: "/student/dashboard" },
    { label: "Browse Courses", href: "/student/courses" },
    { label: "My Learning", href: "/student/my-courses" },
  ],
};

export function DashboardShell({ children, role }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [logout] = useLogoutUserMutation();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout({ refreshToken: "" }).unwrap();
      toast({
        title: "Logged out",
        description: "You have been signed out of EduPulse.",
        variant: "success",
      });
      router.push("/login");
    } catch {
      toast({
        title: "Logout failed",
        description: "You have been redirected to the login screen.",
        variant: "destructive",
      });
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen flex bg-muted/40">
      <aside className="hidden md:flex w-64 flex-col border-r bg-background">
        <div className="px-6 py-5 border-b">
          <h1 className="text-xl font-bold">EduPulse</h1>
          <p className="text-xs text-muted-foreground capitalize">
            {role.toLowerCase()} panel
          </p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navConfig[role].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t px-4 py-4 flex items-center justify-between gap-2 text-xs">
          <div className="flex flex-col">
            <span className="font-medium truncate">{user?.name}</span>
            <span className="text-muted-foreground truncate">
              {user?.email}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-4 py-3 border-b bg-background md:hidden">
          <span className="font-semibold">EduPulse</span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </header>
        <div className="flex-1 p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}

