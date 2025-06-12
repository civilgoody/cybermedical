'use client';

import "./globals.css"
import type React from "react"
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Toaster } from "@/components/ui/sonner"
import { queryClient } from "@/lib/query-client"
import DemoIndicator from "@/components/shared/demo-indicator"

function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Toaster />
      </div>
      <DemoIndicator />
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
          <LayoutContent>{children}</LayoutContent>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  )
}

