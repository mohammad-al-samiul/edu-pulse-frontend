"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, BarChart3, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const router = useRouter();

  const { user } = useAuth();
  useEffect(() => {
    const role = user?.role ?? Cookies.get("role") ?? null;
    const hasToken = !!Cookies.get("accessToken");
    if (!role || !hasToken) return;
    const target =
      role === "ADMIN" || role === "SUPER_ADMIN"
        ? "/admin/dashboard"
        : role === "INSTRUCTOR"
          ? "/instructor/dashboard"
          : "/student/dashboard";
    router.replace(target);
  }, [user, router]);

  if (user || Cookies.get("accessToken")) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-100">
      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold">LMS Platform</h1>

        <div className="space-x-4">
          <Button variant="ghost" onClick={() => router.push("/auth/login")}>
            Login
          </Button>
          <Button onClick={() => router.push("/auth/register")}>
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-20 px-6">
        <Badge className="mb-4">Modern Learning Platform</Badge>

        <h2 className="text-5xl font-bold tracking-tight mb-6">
          Learn. Teach. Grow.
        </h2>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          A scalable SaaS-grade Learning Management System designed for
          students, instructors, and administrators.
        </p>

        <div className="flex justify-center gap-4">
          <Button size="lg" onClick={() => router.push("/auth/register")}>
            Start Learning
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.push("/auth/login")}
          >
            Login
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
            <CardContent className="p-6 space-y-4">
              <GraduationCap className="w-10 h-10 text-primary" />
              <h3 className="text-xl font-semibold">Interactive Courses</h3>
              <p className="text-muted-foreground">
                Structured lessons, preview access, progress tracking, and
                completion analytics.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
            <CardContent className="p-6 space-y-4">
              <BarChart3 className="w-10 h-10 text-primary" />
              <h3 className="text-xl font-semibold">Advanced Analytics</h3>
              <p className="text-muted-foreground">
                Enrollment growth, revenue reports, instructor performance
                insights.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
            <CardContent className="p-6 space-y-4">
              <ShieldCheck className="w-10 h-10 text-primary" />
              <h3 className="text-xl font-semibold">Secure & Scalable</h3>
              <p className="text-muted-foreground">
                JWT authentication, RBAC, rate limiting, and production-ready
                architecture.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} LMS Platform. All rights reserved.
      </footer>
    </div>
  );
}
