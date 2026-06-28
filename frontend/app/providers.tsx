"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 30_000 } },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { background: "#1e1e2e", color: "#fff", border: "1px solid #2a2a3e" },
          success: { iconTheme: { primary: "#7c3aed", secondary: "#fff" } },
        }}
      />
    </QueryClientProvider>
  );
}
