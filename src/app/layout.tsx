import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "../providers/ReduxProvider";
import { QueryProvider } from "../providers/QueryProvider";
import { ToastProvider } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "EduPulse LMS",
  description: "Modern LMS platform built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body suppressHydrationWarning className="bg-background text-foreground">
        <ReduxProvider>
          <QueryProvider>
            <ToastProvider>
              {children}
              <Toaster />
            </ToastProvider>
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
