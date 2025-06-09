'use client';

import "./globals.css"
import type React from "react"
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Header } from "@/components/layout/header"
import { ProfileProvider } from "@/context/ProfileContext"
import { Toaster } from "@/components/ui/sonner"
import { queryClient } from "@/lib/query-client"
import { useProfile } from "@/hooks/use-profile"
import DemoIndicator from "@/components/shared/demo-indicator"

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { user } = useProfile();
  
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        {children}
        <Toaster />
      </div>
      <DemoIndicator userEmail={user?.email} />
    </>
  );
}

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
            <LayoutContent>
              {children}
            </LayoutContent>
          </ProfileProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  )
}

