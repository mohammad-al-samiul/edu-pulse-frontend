"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useRegisterMutation } from "@/features/auth/authApi";
import { registerSchema } from "@/schema/registerSchema";
import { useToast } from "@/components/ui/use-toast";

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

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      }).unwrap();

      setSuccessMessage("Account created successfully. You can now log in.");
      toast({
        title: "Account created",
        description: "You can now sign in to EduPulse.",
        variant: "success",
      });
      reset();
      setTimeout(() => router.push("/auth/login"), 1000);
    } catch {
      setErrorMessage(
        "Could not register with these details. Please try a different email.",
      );
      toast({
        title: "Registration failed",
        description: "Try a different email or check your details.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left: Branding */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50 p-10">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-4 py-1 text-xs font-medium text-slate-200 ring-1 ring-slate-700/60">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
            Start learning today
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight">
            Create your EduPulse account
          </h1>
          <p className="mt-3 max-w-md text-sm text-slate-200/80">
            Join students and instructors building their skills with a modern
            LMS experience.
          </p>
        </div>

        <p className="text-xs text-slate-400">
          Flexible roles · Secure authentication · Analytics-ready
        </p>
      </div>

      {/* Right: Register form */}
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10 bg-background">
        <Card className="w-full max-w-md border-border shadow-lg">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Create an account</CardTitle>
              <Badge variant="secondary" className="uppercase text-[10px]">
                Register
              </Badge>
            </div>
            <CardDescription>
              Sign up with your name, email, and a strong password to get
              started.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {errorMessage && (
              <div className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="rounded-md border border-emerald-500/40 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-600">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  placeholder="Alex Doe"
                  autoComplete="name"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

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
                  <span className="text-xs text-muted-foreground">
                    At least 6 characters
                  </span>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
