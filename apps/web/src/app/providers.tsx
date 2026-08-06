"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
      <Toaster
        theme="system"
        position="top-center"
        richColors
        toastOptions={{
          className: "border border-[var(--border)] bg-[var(--surface)]",
        }}
      />
    </ThemeProvider>
  );
}
