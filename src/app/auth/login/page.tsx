"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import axios from "axios";
import { loginSchema } from "@/schema/loginSchema";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { useSetAtom } from "jotai";
import { authAtom } from "@/state/auth";
import Cookies from "js-cookie";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const setAuth = useSetAtom(authAtom);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (user?.role) {
      if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
        router.replace("/admin/dashboard");
      } else if (user.role === "INSTRUCTOR") {
        router.replace("/instructor/dashboard");
      } else {
        router.replace("/student/dashboard");
      }
    }
  }, [user, router]);

  const onSubmit = async (data: LoginFormValues) => {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const resp = await axios.post(
        (process.env.NEXT_PUBLIC_API_URL ??
          "https://edu-pulse-backend-plum.vercel.app/api/v1") + "/users/login",
        data,
        { withCredentials: true },
      );
      const payload = resp.data?.data ?? resp.data;
      const nextUser = payload?.user ?? null;
      const nextToken = payload?.accessToken ?? null;
      if (nextToken) {
        Cookies.set("accessToken", nextToken, {
          expires: 7,
          sameSite: "lax",
          secure:
            typeof window !== "undefined" &&
            window.location.protocol === "https:",
        });
      }
      if (nextUser?.role) {
        Cookies.set("role", nextUser.role, {
          expires: 7,
          sameSite: "lax",
          secure:
            typeof window !== "undefined" &&
            window.location.protocol === "https:",
        });
      }
      setAuth({ user: nextUser ?? null });

      toast({
        title: "Logged in",
        description: "Welcome back to EduPulse.",
        variant: "success",
      });
    } catch {
      setErrorMessage("Invalid email or password. Please try again.");

      toast({
        title: "Login failed",
        description: "Check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left: Branding */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50 p-10">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-4 py-1 text-xs font-medium text-slate-200 ring-1 ring-slate-700/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Live LMS platform
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight">
            EduPulse LMS
          </h1>
          <p className="mt-3 max-w-md text-sm text-slate-200/80">
            Learn, teach, and manage courses with a modern analytics-driven
            learning platform for students, instructors, and admins.
          </p>
        </div>

        <div className="space-y-4 text-sm text-slate-200/80">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-slate-700/80" />
            <div>
              <p className="font-medium text-slate-50">Role-based dashboards</p>
              <p className="text-xs">
                Separate experiences for students, instructors, and admins.
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            Secure JWT auth · Real-time analytics · Production-ready UI
          </p>
        </div>
      </div>

      {/* Right: Login form */}
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10 bg-background">
        <Card className="w-full max-w-md border-border shadow-lg">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <Badge variant="secondary" className="uppercase text-[10px]">
                Login
              </Badge>
            </div>
            <CardDescription>
              Sign in with your email and password to access your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {errorMessage && (
              <div className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="text-xs text-muted-foreground hover:underline"
                  >
                    Forgot?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="font-medium text-primary hover:underline"
              >
                Create one
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
