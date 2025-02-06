'use client';

import "./globals.css"
import type React from "react"
import { SessionProvider } from "next-auth/react"
import { Header } from "@/components/header"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-foreground">
        <SessionProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  )
}

