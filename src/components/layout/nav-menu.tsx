"use client";

import { Bell, Settings } from "lucide-react"
import { RxDashboard } from "react-icons/rx";
import { usePathname } from "next/navigation";
import Link from "next/link";
import AdminReportsDropdown from "@/components/admin/admin-reports-dropdown";

export function NavMenu() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-6 bg-[#1A1A1A] rounded-full px-4 py-2">
      <Link
        href="/"
        className={`flex items-center gap-2 text-sm px-4 py-3 rounded-lg transition-colors ${
          pathname === "/"
            ? "bg-custom-gradient text-foreground"
            : "text-muted hover:text-foreground"
        }`}
      >
        <RxDashboard className="w-4 h-4" />
        <span>Dashboard</span>
      </Link>
      <button className="flex items-center gap-2 text-[#666666] hover:text-white transition-colors">
        <Bell className="w-4 h-4" />
        <span className="text-sm">Alerts</span>
      </button>
      <AdminReportsDropdown />
      <Link
        href="/settings"
        className={`flex items-center gap-2 text-sm px-4 py-3 rounded-lg transition-colors ${
          pathname.startsWith("/settings")
            ? "bg-custom-gradient text-foreground"
            : "text-muted hover:text-foreground"
        }`}
      >
        <Settings className="w-4 h-4" />
        <span>Settings</span>
      </Link>
    </nav>
  );
} 
