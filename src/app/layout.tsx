'use client';

import "./globals.css"
import type React from "react"
import { Header } from "@/components/header"
import { ProfileProvider } from "@/context/ProfileContext"
import { Toaster } from "@/components/ui/toaster"
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-foreground">
        <ProfileProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            {children}
            <Toaster />
          </div>
        </ProfileProvider>
      </body>
    </html>
  )
}

