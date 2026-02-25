"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useLogoutUserMutation } from "@/features/auth/authApi";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings, ChevronDown } from "lucide-react";
import { DashboardSkeleton } from "@/components/ui/loading-skeleton";

type LinkItem = {
  label: string;
  href: string;
  icon?: string;
};

type RoleOptions = "ADMIN" | "INSTRUCTOR" | "STUDENT" | "SUPER_ADMIN";

type DashboardShellProps = {
  children: ReactNode;
  role?: RoleOptions;
  links?: LinkItem[];
};

const defaultNavConfig: Record<RoleOptions, LinkItem[]> = {
  ADMIN: [
    { label: "Overview", href: "/admin/dashboard", icon: "LayoutDashboard" },
    { label: "Users", href: "/admin/users", icon: "Users" },
    { label: "Categories", href: "/admin/categories", icon: "Folder" },
    { label: "Analytics", href: "/admin/analytics", icon: "BarChart" },
  ],
  SUPER_ADMIN: [
    { label: "Overview", href: "/admin/dashboard", icon: "LayoutDashboard" },
    { label: "Users", href: "/admin/users", icon: "Users" },
    { label: "Categories", href: "/admin/categories", icon: "Folder" },
    { label: "Analytics", href: "/admin/analytics", icon: "BarChart" },
  ],
  INSTRUCTOR: [
    {
      label: "Dashboard",
      href: "/instructor/dashboard",
      icon: "LayoutDashboard",
    },
    { label: "My Courses", href: "/instructor/courses", icon: "BookOpen" },
    { label: "Create Course", href: "/instructor/courses/new", icon: "Plus" },
  ],
  STUDENT: [
    { label: "Dashboard", href: "/student/dashboard", icon: "LayoutDashboard" },
    { label: "Browse Courses", href: "/student/courses", icon: "Search" },
    { label: "My Learning", href: "/student/my-courses", icon: "BookOpen" },
  ],
};

export function DashboardShell({ children, role, links }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isClient } = useAuth();
  const [logout] = useLogoutUserMutation();
  const { toast } = useToast();

  // Use custom links if provided, otherwise fall back to role-based config
  const navLinks: LinkItem[] = links || (role ? defaultNavConfig[role] : []);

  const handleLogout = async () => {
    try {
      await logout({ refreshToken: "" }).unwrap();
      toast({
        title: "Logged out",
        description: "You have been signed out of EduPulse.",
        variant: "success",
      });
      router.push("/auth/login");
    } catch {
      toast({
        title: "Logout failed",
        description: "You have been redirected to the login screen.",
        variant: "destructive",
      });
      router.push("/auth/login");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Show loading state during hydration
  if (!isClient) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen flex bg-muted/40">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-background">
        <div className="px-6 py-5 border-b">
          <h1 className="text-xl font-bold text-primary">EduPulse</h1>
          {role && (
            <p className="text-xs text-muted-foreground capitalize">
              {role.toLowerCase().replace("_", " ")} panel
            </p>
          )}
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navLinks.map((item) => (
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

        <div className="border-t p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start px-2 py-6 h-auto"
              >
                <div className="flex items-center gap-3 w-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={user?.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user?.name ? getInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start flex-1 min-w-0">
                    <span className="text-sm font-medium truncate w-full">
                      {user?.name || "User"}
                    </span>
                    <span className="text-xs text-muted-foreground truncate w-full">
                      {user?.email || ""}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 flex flex-col">
        {/* Mobile header */}
        <header className="flex items-center justify-between px-4 py-3 border-b bg-background md:hidden">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-primary">EduPulse</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {user?.name ? getInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page content */}
        <div className="flex-1 p-4 md:p-6 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
