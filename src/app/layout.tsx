import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "../providers/ReduxProvider";
import { QueryProvider } from "../providers/QueryProvider";
import { ToastProvider } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/error-boundary";
import { initializeErrorHandling } from "@/lib/error-handler";

// Initialize error handling
initializeErrorHandling();

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
        <ErrorBoundary>
          <ReduxProvider>
            <QueryProvider>
              <ToastProvider>
                {children}
                <Toaster />
              </ToastProvider>
            </QueryProvider>
          </ReduxProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
