"use client";

import { useToast } from "./use-toast";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex flex-col items-end gap-2 p-4 sm:p-6">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "pointer-events-auto w-full max-w-xs rounded-lg border px-3 py-2 text-sm shadow-lg bg-background/95 backdrop-blur",
            "flex flex-col gap-1",
            toast.variant === "destructive" &&
              "border-destructive/50 bg-destructive/10 text-destructive",
            toast.variant === "success" &&
              "border-emerald-500/60 bg-emerald-500/10 text-emerald-700",
          )}
          onClick={() => dismiss(toast.id)}
        >
          <span className="font-medium">{toast.title}</span>
          {toast.description && (
            <span className="text-xs text-muted-foreground">
              {toast.description}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

