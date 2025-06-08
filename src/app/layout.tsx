'use client';

import { Header } from "@/components/layout/header";
import { Toaster } from "@/components/ui/toaster";
import { ProfileProvider } from "@/context/ProfileContext";
import { queryClient } from "@/lib/query-client";
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type React from "react";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-foreground">
        <QueryClientProvider client={queryClient}>
          <ProfileProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              {children}
              <Toaster />
            </div>
          </ProfileProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  )
}

